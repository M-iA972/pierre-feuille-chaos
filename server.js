// =============================================================
// server.js — Le serveur : il sert le dossier public/ et,
// pour le mode « Jouer en ligne », il garde une file d'attente,
// met les joueuses deux par deux et arbitre les manches.
// Les parties vivent en mémoire : si le serveur redémarre, elles disparaissent.
// =============================================================
const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const { COUPS_DE_BASE, INVERSE, jugerManche, bonusDeLaManche } = require('./public/regles.js');

const app = express();
const serveur = http.createServer(app);
const io = new Server(serveur);
const PORT = process.env.PORT || 3000;
const POINTS_POUR_GAGNER = 3;

// Sert les fichiers du jeu (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// La file d'attente : la joueuse qui attend une adversaire (une seule à la fois)
let enAttente = null;

// (Re)lance une partie : scores à zéro, et chacune reçoit son premier bonus
function commencerPartie(partie) {
  partie.scores = [0, 0];
  partie.coups = [null, null];
  partie.revanche = [false, false];
  partie.bonus = [bonusDeLaManche(), bonusDeLaManche()];
  partie.joueuses.forEach((j, i) => j.emit('partie-commence', { bonus: partie.bonus[i] }));
}

// Met deux joueuses ensemble dans une nouvelle partie
function creerPartie(a, b) {
  const partie = { joueuses: [a, b] };
  a.data.partie = partie;   // chaque joueuse retient sa partie
  b.data.partie = partie;
  commencerPartie(partie);
}

// Vrai si quelqu'un a atteint 3 points
function estFinie(partie) {
  return Math.max(...partie.scores) >= POINTS_POUR_GAGNER;
}

// Quand les deux ont joué : on juge, on compte, on envoie le résultat à chacune
function jugerEtEnvoyer(partie) {
  const [coup0, coup1] = partie.coups;
  const r = jugerManche(coup0, coup1); // du point de vue de la joueuse 0
  if (r.issue === 'gagne') partie.scores[0]++;
  if (r.issue === 'perd') partie.scores[1]++;

  // On prépare déjà la manche suivante
  partie.coups = [null, null];
  partie.bonus = [bonusDeLaManche(), bonusDeLaManche()];

  // Chacune reçoit le résultat vu de son côté (gagne pour l'une = perd pour l'autre)
  partie.joueuses[0].emit('resultat', { moi: coup0, adv: coup1, issue: r.issue, bonusSuivant: partie.bonus[0] });
  partie.joueuses[1].emit('resultat', { moi: coup1, adv: coup0, issue: INVERSE[r.issue], bonusSuivant: partie.bonus[1] });
}

// Retire une joueuse de la file d'attente et de sa partie (l'autre est prévenue)
function quitter(socket) {
  if (enAttente === socket) enAttente = null;
  const partie = socket.data.partie;
  if (!partie) return;
  partie.joueuses.forEach((j) => {
    j.data.partie = null;
    if (j !== socket) j.emit('adversaire-parti');
  });
}

// Chaque navigateur qui se connecte
io.on('connection', (socket) => {
  // « Jouer en ligne » ou « Nouvelle adversaire » : on forme une paire, ou on attend
  socket.on('chercher', () => {
    quitter(socket);
    if (enAttente && enAttente.connected) {
      const adversaire = enAttente;
      enAttente = null;
      creerPartie(adversaire, socket);
    } else {
      enAttente = socket;
    }
  });

  // Une joueuse choisit son coup : le serveur vérifie qu'elle a le droit
  socket.on('jouer', (coup) => {
    const partie = socket.data.partie;
    if (!partie || estFinie(partie) || typeof coup !== 'string') return;
    const i = partie.joueuses.indexOf(socket);
    const autorise = COUPS_DE_BASE.includes(coup) || coup === partie.bonus[i];
    if (!autorise || partie.coups[i]) return; // coup interdit ou déjà joué
    partie.coups[i] = coup;
    if (partie.coups[0] && partie.coups[1]) jugerEtEnvoyer(partie);
  });

  // « Revanche ? » : la partie repart quand les deux ont cliqué
  socket.on('revanche', () => {
    const partie = socket.data.partie;
    if (!partie || !estFinie(partie)) return;
    partie.revanche[partie.joueuses.indexOf(socket)] = true;
    if (partie.revanche[0] && partie.revanche[1]) commencerPartie(partie);
  });

  // « Annuler », « Jouer contre l'ordi », « Accueil », ou page fermée
  socket.on('quitter', () => quitter(socket));
  socket.on('disconnect', () => quitter(socket));
});

serveur.listen(PORT, () => {
  console.log(`Pierre Feuille Chaos sur http://localhost:${PORT}`);
});

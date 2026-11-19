// =============================================================
// online.js — Le mode « Jouer en ligne », avec recherche automatique
// Le serveur garde une file d'attente, forme les paires, tire les bonus
// et juge les manches. Ce fichier envoie les clics au serveur et affiche
// ses réponses en réutilisant les fonctions d'affichage de script.js.
// =============================================================
let socket = null;  // la connexion au serveur (créée au premier clic sur « Jouer en ligne »)

// « Jouer en ligne » ou « Nouvelle adversaire » : on entre dans la file d'attente
function chercherAdversaire() {
  if (typeof io === 'undefined') {   // page ouverte sans serveur : pas de mode en ligne
    $('info-accueil').textContent = TEXTES.interface.bientot;
    return;
  }
  if (!socket) brancherSocket();
  reveillerSon();
  arreterTout();
  socket.emit('chercher');
  afficherEcran('salon');
}

// Ouvre la connexion et dit quoi faire pour chaque message du serveur
function brancherSocket() {
  socket = io();

  // Une adversaire est trouvée (ou les deux ont demandé la revanche) : la partie commence
  socket.on('partie-commence', (donnees) => {
    demarrerPartie('en-ligne');
    nouvelleManche(donnees.bonus);
  });

  // Les deux joueuses ont choisi : le serveur envoie le résultat de la manche
  socket.on('resultat', (r) => {
    etat.bonusSuivant = r.bonusSuivant;
    jouerManche(r.moi, r.adv, { issue: r.issue });
  });

  // L'adversaire a fermé la page, cliqué sur « Accueil » ou « Nouvelle adversaire »
  socket.on('adversaire-parti', montrerDepart);

  // Connexion perdue (serveur redémarré) pendant une partie en ligne
  socket.on('disconnect', () => {
    const enJeu = ['partie', 'fin', 'salon'].some((nom) => !$('ecran-' + nom).classList.contains('cache'));
    if (etat.mode === 'en-ligne' && enJeu) montrerDepart();
  });
}

// Affiche l'écran « Ton adversaire a quitté la partie »
function montrerDepart() {
  arreterTout();
  afficherEcran('parti');
}

// Envoie mon coup au serveur ; il reste secret jusqu'à la révélation
function envoyerCoupEnLigne(coup) {
  socket.emit('jouer', coup);
  $('message').textContent = TEXTES.interface.attente;
}

// « Revanche ? » en ligne : la partie repart quand les deux ont cliqué
function demanderRevanche() {
  socket.emit('revanche');
  $('btn-revanche').disabled = true;
  $('fin-info').textContent = TEXTES.interface.attente;
}

// Sort de la file d'attente ou quitte la partie en ligne
function quitterEnLigne() {
  if (socket) socket.emit('quitter');
}

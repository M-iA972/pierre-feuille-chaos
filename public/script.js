// =============================================================
// script.js — Le jeu solo, et l'affichage commun aux deux modes
// Les règles sont dans regles.js, les textes dans contenus.js,
// les dessins dans persos.js.
// =============================================================

// ---------- 1. L'état de la partie : tout ce qu'il faut retenir ----------
const etat = {
  mode: 'solo',        // 'solo' (contre l'ordi) ou 'en-ligne'
  moi: 0,              // points de la joueuse
  adv: 0,              // points de l'adversaire (ordi ou adversaire en ligne)
  manches: 0,          // nombre de manches jouées
  bonus: null,         // bonus proposé pour cette manche (ou null)
  coupOrdi: null,      // coup de l'ordi, choisi au début de la manche, jamais modifié
  bonusSuivant: null,  // en ligne : bonus envoyé par le serveur pour la manche d'après
  verrou: true,        // true = les boutons de coup sont bloqués
  jeton: 0,            // numéro de partie : s'il change, l'ancienne partie s'arrête
  son: true,           // bruitages activés ou coupés
  serie: 0,            // parties gagnées d'affilée
  derniereBlague: -1   // pour ne pas répéter la même blague deux fois de suite
};
const POINTS_POUR_GAGNER = 3;
const IMPACT = 450;        // moment du choc, en millisecondes après la révélation
let contexteAudio = null;  // le « synthétiseur » du navigateur, pour les bruitages

// ---------- 2. Petits outils ----------
const $ = (id) => document.getElementById(id);
const auHasard = (liste) => liste[Math.floor(Math.random() * liste.length)];
const attendre = (ms) => new Promise((fin) => setTimeout(fin, ms));
const nomAdversaire = () => (etat.mode === 'solo' ? TEXTES.interface.ordi : TEXTES.interface.adversaire);

// Remplit la page : textes de contenus.js, dessins de persos.js, règles des boutons
function remplirTextes() {
  document.querySelectorAll('[data-texte]').forEach((el) => (el.textContent = TEXTES.interface[el.dataset.texte]));
  document.querySelectorAll('[data-nom]').forEach((el) => (el.textContent = TEXTES.noms[el.dataset.nom]));
  document.querySelectorAll('[data-dessin]').forEach((el) => (el.innerHTML = dessin(el.dataset.dessin)));
  document.querySelectorAll('.coup[data-coup]').forEach((b) => (b.dataset.regles = reglesEnSymboles(b.dataset.coup)));
}

// Écrit les règles d'un coup en symboles, ex. « 🎈 > 📄 | 🎈 < ✂️ | 🎈 = 🪨 »
function reglesEnSymboles(coup) {
  const moi = REGLES[coup].emoji;
  const groupe = (issue, signe) => {
    const cibles = COUPS_DE_BASE.filter((c) => c !== coup && REGLES[coup].contre[c] === issue);
    return cibles.length ? `${moi} ${signe} ${cibles.map((c) => REGLES[c].emoji).join(' ')}` : null;
  };
  return [groupe('gagne', '>'), groupe('perd', '<'), groupe('egalite', '=')].filter(Boolean).join(' | ');
}

// Affiche un seul écran et cache tous les autres
function afficherEcran(nom) {
  document.querySelectorAll('.ecran').forEach((ecran) => ecran.classList.add('cache'));
  $('ecran-' + nom).classList.remove('cache');
}

// ---------- 3. Les bruitages, fabriqués par le navigateur (Web Audio, aucun fichier) ----------

// Allume le synthétiseur (les navigateurs l'autorisent seulement après un clic)
function reveillerSon() {
  try {
    contexteAudio = contexteAudio || new (window.AudioContext || window.webkitAudioContext)();
    if (contexteAudio.state === 'suspended') contexteAudio.resume();
  } catch (e) { /* pas de son possible : le jeu continue */ }
}

// Une note qui glisse d'une fréquence à une autre en s'éteignant (boum, pop, bonk…)
function note(forme, debut, fin, duree, volume, decalage = 0) {
  const t = contexteAudio.currentTime + decalage;
  const oscillateur = contexteAudio.createOscillator();
  const gain = contexteAudio.createGain();
  oscillateur.type = forme;
  oscillateur.frequency.setValueAtTime(debut, t);
  oscillateur.frequency.exponentialRampToValueAtTime(fin, t + duree);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duree);
  oscillateur.connect(gain).connect(contexteAudio.destination);
  oscillateur.start(t);
  oscillateur.stop(t + duree);
}

// Un souffle (bruit filtré) qui s'éteint (tchac, flap, splash…)
function souffle(filtre, debut, fin, duree, volume, decalage = 0) {
  const t = contexteAudio.currentTime + decalage;
  const taille = Math.floor(contexteAudio.sampleRate * duree);
  const tampon = contexteAudio.createBuffer(1, taille, contexteAudio.sampleRate);
  const donnees = tampon.getChannelData(0);
  for (let i = 0; i < taille; i++) donnees[i] = Math.random() * 2 - 1; // du « grésillement »
  const source = contexteAudio.createBufferSource();
  const filtreAudio = contexteAudio.createBiquadFilter();
  const gain = contexteAudio.createGain();
  source.buffer = tampon;
  filtreAudio.type = filtre;
  filtreAudio.frequency.setValueAtTime(debut, t);
  filtreAudio.frequency.exponentialRampToValueAtTime(fin, t + duree);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duree);
  source.connect(filtreAudio).connect(gain).connect(contexteAudio.destination);
  source.start(t);
}

// La recette de chaque bruitage
const BRUITAGES = {
  tchac: () => { souffle('highpass', 5000, 2500, 0.06, 0.6); souffle('highpass', 5000, 2500, 0.08, 0.6, 0.09); },
  boum: () => { note('sine', 150, 40, 0.5, 0.9); souffle('lowpass', 700, 100, 0.3, 0.5); },
  flap: () => [0, 0.07, 0.14].forEach((d) => souffle('bandpass', 1200, 500, 0.06, 0.8, d)),
  pop: () => { note('sine', 900, 120, 0.1, 0.7); souffle('highpass', 3000, 1500, 0.05, 0.5); },
  splash: () => { souffle('lowpass', 5000, 300, 0.5, 0.7); note('sine', 600, 200, 0.15, 0.2); },
  sploutch: () => { note('triangle', 320, 60, 0.35, 0.7); souffle('lowpass', 900, 150, 0.3, 0.5, 0.05); },
  scritch: () => [0, 0.1, 0.2, 0.3].forEach((d) => souffle('bandpass', 3500, 2000, 0.07, 0.5, d)),
  bonk: () => note('sine', 520, 260, 0.2, 0.6)
};

// Joue un bruitage, sauf si le son est coupé ; une erreur ne bloque jamais le jeu
function bruitage(nom) {
  if (!etat.son || !contexteAudio) return;
  try { BRUITAGES[nom](); } catch (e) { /* tant pis pour le son */ }
}

// Bouton 🔊 / 🔇 : coupe ou active les bruitages
function basculerSon() {
  etat.son = !etat.son;
  $('btn-son').textContent = etat.son ? '🔊' : '🔇';
}

// ---------- 4. Le meilleur résultat (localStorage, peut être indisponible) ----------
function lireRecord() {
  try { return Number(localStorage.getItem('pfc-record')) || 0; } catch (e) { return 0; }
}
function enregistrerRecord(n) {
  try { localStorage.setItem('pfc-record', n); } catch (e) { /* navigation privée : pas de record */ }
}
function afficherRecord() {
  $('record').textContent = TEXTES.record(lireRecord());
}

// ---------- 5. Déroulement d'une partie ----------

// Arrête proprement la manche en cours
function arreterTout() {
  etat.jeton++;              // les anciennes attentes verront que le jeton a changé
  verrouiller(true);
}

// Démarre une partie neuve (aussi utilisé par « Revanche ? »)
function demarrerPartie(mode) {
  arreterTout();
  etat.mode = mode;
  etat.moi = 0;
  etat.adv = 0;
  etat.manches = 0;
  document.querySelectorAll('[data-adv]').forEach((el) => (el.textContent = nomAdversaire()));
  $('historique').innerHTML = '';
  $('fin-info').textContent = '';
  $('btn-revanche').disabled = false;
  dessinerScore();
  preparerArene();
  afficherEcran('partie');
  if (mode === 'solo') nouvelleManche(bonusDeLaManche());
  // en ligne, c'est online.js qui lance la première manche
}

// Prépare une manche : l'ordi choisit, bonus éventuel, boutons débloqués
function nouvelleManche(bonus) {
  etat.bonus = bonus;
  if (bonus) {
    $('bonus-perso').innerHTML = dessin(bonus);
    $('bonus-nom').textContent = TEXTES.noms[bonus];
    $('bonus').dataset.regles = reglesEnSymboles(bonus);
  }
  $('case-bonus').classList.toggle('cache', !bonus);
  if (etat.mode === 'solo') etat.coupOrdi = coupAuHasard(); // l'ordi choisit AVANT la joueuse, au hasard
  verrouiller(false);
}

// Bloque ou débloque les boutons de coup
function verrouiller(oui) {
  etat.verrou = oui;
  document.querySelectorAll('.coup').forEach((bouton) => (bouton.disabled = oui));
}

// Remet l'arène à zéro : points d'interrogation, « VS », plus d'animation
function preparerArene() {
  $('arene').className = 'arene';
  $('arene').querySelectorAll('.particule').forEach((p) => p.remove());
  ['coup-moi', 'coup-adv'].forEach((id) => {
    $(id).className = 'coup-geant';
    $(id).innerHTML = '<span class="mystere">?</span>';
  });
  afficherCentre(TEXTES.interface.vs, '');
  $('papier').classList.add('cache');
  $('message').className = 'message';
  $('message').textContent = '';
}

// Écrit « VS » ou un chiffre du décompte au milieu du duel (avec un petit zoom)
function afficherCentre(texte, classe) {
  const centre = $('centre');
  centre.textContent = texte;
  centre.className = 'centre';
  void centre.offsetWidth;           // force le navigateur à rejouer l'animation
  if (classe) centre.classList.add(classe);
}

// Clic sur Pierre, Feuille, Ciseaux ou l'outil bonus
function jouerCoup(coup) {
  if (etat.verrou || !coup) return;   // double clic : le 2e clic est ignoré
  reveillerSon();
  verrouiller(true);
  $('case-bonus').classList.add('cache');
  preparerArene();
  $('arene').scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (etat.mode === 'solo') {
    jouerManche(coup, etat.coupOrdi, jugerManche(coup, etat.coupOrdi));
  } else {
    envoyerCoupEnLigne(coup);  // online.js : le serveur répondra quand l'adversaire aura joué
  }
}

// Joue une manche à l'écran : décompte, révélation, choc, résultat, suite
async function jouerManche(moi, adv, resultat) {
  const jeton = etat.jeton;
  const toujoursLa = () => jeton === etat.jeton;  // faux si la joueuse est partie
  const [un, deux, trois] = TEXTES.decompte;
  $('message').textContent = '';   // efface « En attente de ton adversaire… »

  // 1. Décompte « 1… 2… » au centre
  for (const chiffre of [un, deux]) {
    afficherCentre(chiffre, 'decompte');
    await attendre(500);
    if (!toujoursLa()) return;
  }

  // 2. Au « 3 ! », les deux coups apparaissent et l'animation se joue
  afficherCentre(trois, 'decompte');
  montrerCoup($('coup-moi'), moi);
  montrerCoup($('coup-adv'), adv);
  animer(moi, adv, resultat);
  await attendre(1300);
  if (!toujoursLa()) return;
  // fin de l'animation : chaque coup reprend sa place, le perdant reste grisé
  $('arene').classList.add('fini');
  afficherCentre(TEXTES.interface.vs, '');

  // 3. La phrase qui explique, le score, l'historique
  etat.manches++;
  afficherResultat(moi, adv, resultat.issue);
  await attendre(2200);
  if (!toujoursLa()) return;

  // 4. Fin de partie ou manche suivante
  if (etat.moi >= POINTS_POUR_GAGNER || etat.adv >= POINTS_POUR_GAGNER) finDePartie();
  else nouvelleManche(etat.mode === 'solo' ? bonusDeLaManche() : etat.bonusSuivant);
}

// Dessine un coup dans l'arène, avec un visage normal
function montrerCoup(el, coup) {
  el.innerHTML = dessin(coup);
  humeur(el, 'normal');
}

// Change l'expression d'un personnage : normal, fier, peur, sonne, etonne
function humeur(el, expression) {
  el.dataset.humeur = expression;
}

// Qui a gagné, qui a perdu ? (en cas d'égalité : moi d'abord)
function gagnantPerdant(moi, adv, issue) {
  return issue === 'perd' ? [adv, moi] : [moi, adv];
}

// Affiche la phrase qui explique le résultat et compte le point
function afficherResultat(moi, adv, issue) {
  const [gagnant, perdant] = gagnantPerdant(moi, adv, issue);
  if (issue === 'gagne') etat.moi++;
  if (issue === 'perd') etat.adv++;
  $('message').textContent = issue === 'egalite' ? TEXTES.egalite : TEXTES.actions[gagnant + '-' + perdant];
  $('message').className = 'message ' + issue;
  dessinerScore(issue);
  ajouterHistorique(moi, adv, issue);
}

// Ajoute une manche à l'historique : mon coup / son coup + pastille verte, rouge ou grise
function ajouterHistorique(moi, adv, issue) {
  const manche = document.createElement('span');
  manche.className = 'manche-histo ' + issue;
  manche.innerHTML = `<span class="mini" data-humeur="normal">${dessin(moi)}</span>
    <span class="mini" data-humeur="normal">${dessin(adv)}</span><span class="pastille"></span>`;
  $('historique').appendChild(manche);
}

// Met à jour le score, les cœurs (joueuse) et les étoiles (adversaire)
function dessinerScore(issue) {
  $('score').textContent = etat.moi + ' – ' + etat.adv;
  remplirJauge($('jauge-moi'), etat.moi, '♡', '♥', issue === 'gagne');
  remplirJauge($('jauge-adv'), etat.adv, '☆', '★', issue === 'perd');
}

// Dessine 3 symboles, pleins jusqu'au nombre de points ; le dernier rempli rebondit
function remplirJauge(jauge, points, vide, plein, rebond) {
  jauge.innerHTML = '';
  for (let i = 1; i <= POINTS_POUR_GAGNER; i++) {
    const symbole = document.createElement('span');
    symbole.textContent = i <= points ? plein : vide;
    if (i <= points) symbole.classList.add('plein');
    if (rebond && i === points) symbole.classList.add('rebond');
    jauge.appendChild(symbole);
  }
}

// Écran de fin : victoire (confettis) ou défaite (l'écran tremble)
function finDePartie() {
  const gagne = etat.moi > etat.adv;
  const defaite = etat.mode === 'solo' ? TEXTES.defaitePartie : TEXTES.defaiteEnLigne;
  $('fin-titre').textContent = gagne ? TEXTES.victoirePartie : defaite;
  $('fin-score').textContent = TEXTES.scoreFin(etat.moi, etat.adv, nomAdversaire(), etat.manches);
  $('btn-nouvelle').classList.toggle('cache', etat.mode === 'solo'); // « Nouvelle adversaire » : en ligne seulement
  afficherEcran('fin');
  if (gagne) {
    etat.serie++;
    if (etat.serie > lireRecord()) enregistrerRecord(etat.serie);
    pluieDeConfettis();
  } else {
    etat.serie = 0;
    secouer();
  }
}

// « Revanche ? » : en solo on rejoue tout de suite, en ligne il faut que les deux cliquent
function revanche() {
  if (etat.mode === 'solo') demarrerPartie('solo');
  else demanderRevanche();   // online.js
}

// Retour à l'accueil, même en pleine partie : on abandonne proprement
function allerAccueil() {
  arreterTout();
  quitterEnLigne();
  $('info-accueil').textContent = '';
  afficherRecord();
  afficherEcran('accueil');
}

// ---------- 6. Les animations (elles ne bloquent jamais le jeu) ----------

// Pour chaque duel « gagnant-perdant » : l'animation CSS et le bruitage du choc
const ACTIONS = {
  'ciseaux-feuille': { anim: 'coupe', son: 'tchac' },
  'feuille-pierre': { anim: 'recouvre', son: 'flap' },
  'pierre-ciseaux': { anim: 'casse', son: 'boum' },
  'stylo-feuille': { anim: 'blague', son: 'scritch' },
  'pierre-stylo': { anim: 'ecrase', son: 'boum' },
  'ciseaux-stylo': { anim: 'coupe', son: 'tchac' },
  'eau-feuille': { anim: 'detrempe', son: 'splash' },
  'eau-ciseaux': { anim: 'rouille', son: 'splash' },
  'pierre-eau': { anim: 'glisse', son: 'splash' },
  'ballon-feuille': { anim: 'envole', son: 'flap' },
  'ciseaux-ballon': { anim: 'eclate', son: 'pop' },
  glu: { anim: 'colle', son: 'sploutch' },      // la Super Glu gagne contre tout
  egalite: { anim: 'cogne', son: 'bonk' },      // les deux se cognent
  rebond: { anim: 'rebondit', son: 'bonk' }     // le ballon rebondit sur la pierre
};

// Choisit l'action à jouer pour ce duel
function choisirAction(gagnant, perdant, egalite) {
  if (!egalite) return ACTIONS[gagnant + '-' + perdant] || ACTIONS[gagnant];
  const ballonContreBase = (gagnant === 'ballon') !== (perdant === 'ballon') && !(estBonus(gagnant) && estBonus(perdant));
  return ballonContreBase ? ACTIONS.rebond : ACTIONS.egalite;
}

// Lance l'animation : visages, mouvements CSS, puis le choc (bruit, paillettes, secousse)
function animer(moi, adv, resultat) {
  try {
    const egalite = resultat.issue === 'egalite';
    const jePerds = resultat.issue === 'perd';
    const elMoi = $('coup-moi');
    const elAdv = $('coup-adv');
    const [gagnant, perdant] = gagnantPerdant(moi, adv, resultat.issue);
    const [elGagnant, elPerdant] = jePerds ? [elAdv, elMoi] : [elMoi, elAdv];
    const elBonus = estBonus(moi) ? elMoi : elAdv;     // le coup bonus (s'il y en a un)
    const elCible = elBonus === elMoi ? elAdv : elMoi; // le coup d'en face
    if (estBonus(moi) || estBonus(adv)) elBonus.classList.add('bonus');
    const contact = pointDeContact(elGagnant, elPerdant, egalite);
    const action = choisirAction(gagnant, perdant, egalite);

    // Avant le choc : le perdant a peur, ou les deux sont étonnés
    if (egalite) {
      humeur(elMoi, 'etonne');
      humeur(elAdv, 'etonne');
    } else {
      elGagnant.classList.add('gagnant');
      elPerdant.classList.add('perdant');
      humeur(elPerdant, 'peur');
    }
    $('arene').classList.add('anim-' + action.anim);
    if (action.anim === 'blague') ecrireBlague();

    // Le choc : bruit, paillettes, secousse ; le gagnant est fier, le perdant sonné
    const jeton = etat.jeton;
    setTimeout(() => {
      if (jeton !== etat.jeton) return;
      bruitage(action.son);
      paillettes(contact.x, contact.y);
      secouer();
      if (!egalite) {
        humeur(elGagnant, 'fier');
        humeur(elPerdant, 'sonne');
      }
      if (action.anim === 'coupe' || action.anim === 'casse') couperEnDeux(elPerdant);
      if (['detrempe', 'rouille', 'glisse'].includes(action.anim)) particules(elCible, ['💧'], 12);
      if (action.anim === 'eclate') particules(elPerdant, ['🎊', '✨', '🎉'], 14);
    }, IMPACT);
  } catch (e) {
    console.warn('Animation ratée, le jeu continue :', e);
  }
}

// Le point de contact, dans l'arène : près du perdant (au milieu en cas d'égalité)
function pointDeContact(elGagnant, elPerdant, egalite) {
  const arene = $('arene').getBoundingClientRect();
  const centre = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2 - arene.left, y: r.top + r.height / 2 - arene.top };
  };
  const g = centre(elGagnant);
  const p = centre(elPerdant);
  const part = egalite ? 0.5 : 0.7;
  return { x: g.x + (p.x - g.x) * part, y: (g.y + p.y) / 2 };
}

// Coupe un dessin en deux moitiés (le CSS les écarte un peu)
function couperEnDeux(el) {
  const contenu = el.innerHTML;
  el.innerHTML = `<span class="moitie g">${contenu}</span><span class="moitie d">${contenu}</span>`;
}

// Le stylo écrit une blague lettre par lettre sur la feuille
function ecrireBlague() {
  let i;
  do { i = Math.floor(Math.random() * TEXTES.blagues.length); } while (i === etat.derniereBlague);
  etat.derniereBlague = i;
  const blague = TEXTES.blagues[i];
  const papier = $('papier');
  papier.textContent = '';
  papier.classList.remove('cache');
  let lettres = 0;
  const minuteur = setInterval(() => {
    if (papier.classList.contains('cache')) return clearInterval(minuteur); // manche suivante
    papier.textContent = blague.slice(0, ++lettres);
    if (lettres >= blague.length) clearInterval(minuteur);
  }, 35);
}

// Explosion de paillettes pastel au point de contact
function paillettes(x, y) {
  const couleurs = ['#FFC8DD', '#BDE0FE', '#CDB4DB', '#FFF1A8', '#FFFFFF'];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('span');
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 90;
    p.className = 'particule paillette';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.background = auHasard(couleurs);
    p.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
    $('arene').appendChild(p);
  }
}

// Petits symboles (gouttes, confettis) qui jaillissent d'un coup
function particules(cible, symboles, nombre) {
  const arene = $('arene').getBoundingClientRect();
  const c = cible.getBoundingClientRect();
  for (let i = 0; i < nombre; i++) {
    const p = document.createElement('span');
    p.className = 'particule jaillit';
    p.textContent = auHasard(symboles);
    p.style.left = c.left - arene.left + c.width / 2 + 'px';
    p.style.top = c.top - arene.top + c.height / 2 + 'px';
    p.style.setProperty('--dx', Math.random() * 160 - 80 + 'px');
    p.style.setProperty('--dy', Math.random() * 140 - 100 + 'px');
    p.style.animationDelay = Math.random() * 0.3 + 's';
    $('arene').appendChild(p);
  }
}

// Victoire : pluie de confettis pastel sur tout l'écran
function pluieDeConfettis() {
  const couleurs = ['#FFC8DD', '#BDE0FE', '#CDB4DB', '#FFF1A8'];
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('span');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.background = auHasard(couleurs);
    confetti.style.animationDelay = Math.random() * 1.5 + 's';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
  }
}

// La carte du jeu tremble brièvement (choc, ou partie perdue)
function secouer() {
  const carte = $('carte');
  carte.classList.remove('secousse');
  void carte.offsetWidth;
  carte.classList.add('secousse');
}

// ---------- 7. Infobulles de règles : survol sur ordinateur, appui long sur mobile ----------
function brancherAppuiLong() {
  document.querySelectorAll('.coup').forEach((bouton) => {
    let minuteur = null;
    let appuiLong = false;
    const cacher = () => {
      clearTimeout(minuteur);
      bouton.classList.remove('montre-regles');
    };
    bouton.addEventListener('touchstart', () => {
      appuiLong = false;
      minuteur = setTimeout(() => {
        appuiLong = true;
        bouton.classList.add('montre-regles');
      }, 450);
    }, { passive: true });
    bouton.addEventListener('touchend', (e) => {
      cacher();
      if (appuiLong) e.preventDefault();  // un appui long montre les règles, il ne joue pas
    });
    bouton.addEventListener('touchmove', cacher, { passive: true });
    bouton.addEventListener('contextmenu', (e) => e.preventDefault());
  });
}

// ---------- 8. Démarrage : textes, record, et branchement des boutons ----------
remplirTextes();
afficherRecord();
brancherAppuiLong();
document.querySelectorAll('.coup[data-coup]').forEach((bouton) => {
  bouton.addEventListener('click', () => jouerCoup(bouton.dataset.coup));
});
$('bonus').addEventListener('click', () => jouerCoup(etat.bonus));
$('btn-son').addEventListener('click', basculerSon);
$('btn-ordi').addEventListener('click', () => {
  reveillerSon();
  demarrerPartie('solo');
});
$('btn-en-ligne').addEventListener('click', () => chercherAdversaire());
$('btn-nouvelle').addEventListener('click', () => chercherAdversaire());
$('btn-salon-ordi').addEventListener('click', () => {
  quitterEnLigne();          // arrête la recherche
  demarrerPartie('solo');
});
$('btn-revanche').addEventListener('click', revanche);
$('btn-accueil').addEventListener('click', allerAccueil);
$('btn-quitter').addEventListener('click', allerAccueil);
$('btn-parti-accueil').addEventListener('click', allerAccueil);
$('btn-annuler').addEventListener('click', allerAccueil);

// =============================================================
// regles.js — TOUTES les règles du jeu, au même endroit
// Fichier partagé : le navigateur s'en sert en mode solo,
// et le serveur s'en sert en mode en ligne (c'est lui l'arbitre).
// =============================================================

// L'objet « qui bat qui » : une ligne par coup.
// - emoji  : le symbole utilisé dans les infobulles de règles
// - chance : poids au tirage du bonus (0 = coup de base, pas un bonus)
// - contre : résultat de CE coup contre pierre, feuille et ciseaux
//            'gagne', 'perd' ou 'egalite'
// Ajouter un bonus = ajouter une ligne ici (+ son nom, ses phrases et son dessin).
const REGLES = {
  pierre:  { emoji: '🪨', chance: 0,  contre: { pierre: 'egalite', feuille: 'perd',    ciseaux: 'gagne'   } },
  feuille: { emoji: '📄', chance: 0,  contre: { pierre: 'gagne',   feuille: 'egalite', ciseaux: 'perd'    } },
  ciseaux: { emoji: '✂️', chance: 0,  contre: { pierre: 'perd',    feuille: 'gagne',   ciseaux: 'egalite' } },
  stylo:   { emoji: '🖊️', chance: 30, contre: { pierre: 'perd',    feuille: 'gagne',   ciseaux: 'perd'    } },
  glu:     { emoji: '🧴', chance: 10, contre: { pierre: 'gagne',   feuille: 'gagne',   ciseaux: 'gagne'   } },
  eau:     { emoji: '💦', chance: 30, contre: { pierre: 'perd',    feuille: 'gagne',   ciseaux: 'gagne'   } },
  ballon:  { emoji: '🎈', chance: 30, contre: { pierre: 'egalite', feuille: 'gagne',   ciseaux: 'perd'    } }
};

// Les trois coups que tout le monde a toujours
const COUPS_DE_BASE = ['pierre', 'feuille', 'ciseaux'];

// Ce qui est gagné par l'une est perdu par l'autre
const INVERSE = { gagne: 'perd', perd: 'gagne', egalite: 'egalite' };

// Vrai si le coup est un bonus (il a une chance d'être tiré)
function estBonus(coup) {
  return REGLES[coup].chance > 0;
}

// Le choix honnête de l'ordi : un coup de base au hasard, rien d'autre
function coupAuHasard() {
  return COUPS_DE_BASE[Math.floor(Math.random() * COUPS_DE_BASE.length)];
}

// Tire un bonus selon les chances (la Super Glu est plus rare : 1 sur 10)
function tirerBonus() {
  const bonus = Object.keys(REGLES).filter(estBonus);
  const total = bonus.reduce((somme, nom) => somme + REGLES[nom].chance, 0);
  let tirage = Math.random() * total;
  for (const nom of bonus) {
    tirage -= REGLES[nom].chance;
    if (tirage < 0) return nom;
  }
  return bonus[0];
}

// Le bonus de la manche : 1 chance sur 2 d'en avoir un, sinon null
function bonusDeLaManche() {
  return Math.random() < 0.5 ? tirerBonus() : null;
}

// Juge une manche du point de vue du coup « a » contre le coup « b ».
// Renvoie { issue: 'gagne' | 'perd' | 'egalite' }
function jugerManche(a, b) {
  let issue;
  if (estBonus(a) && estBonus(b)) issue = 'egalite';          // bonus contre bonus
  else if (estBonus(b)) issue = INVERSE[REGLES[b].contre[a]]; // on lit la ligne du bonus, à l'envers
  else issue = REGLES[a].contre[b];                           // cas normal
  return { issue };
}

// Permet au serveur Node de lire ce fichier (le navigateur ignore cette ligne)
if (typeof module !== 'undefined') {
  module.exports = { REGLES, COUPS_DE_BASE, INVERSE, estBonus, jugerManche, bonusDeLaManche };
}

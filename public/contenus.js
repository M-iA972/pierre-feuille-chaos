// =============================================================
// contenus.js — TOUS les textes du jeu
// Pour changer un texte, on le change ici, et nulle part ailleurs.
// =============================================================
const TEXTES = {
  // Boutons, titres et petites étiquettes de l'interface
  interface: {
    titre: 'Pierre Feuille Chaos',
    sousTitre: "Pierre, feuille, ciseaux… et beaucoup de n'importe quoi",
    contreOrdi: "Contre l'ordi",
    jouerEnLigne: 'Jouer en ligne',
    bientot: 'Bientôt disponible',
    toi: 'Toi',
    ordi: 'Ordi',
    adversaire: 'Adversaire',
    vs: 'VS',
    outilBonus: 'Outil bonus',
    revanche: 'Revanche ?',
    nouvelleAdversaire: 'Nouvelle adversaire',
    accueil: 'Accueil',
    recherche: "Recherche d'une adversaire…",
    jouerOrdi: "Jouer contre l'ordi",
    annuler: 'Annuler',
    attente: 'En attente de ton adversaire…',
    parti: 'Ton adversaire a quitté la partie.'
  },

  // Le décompte avant la révélation, affiché chiffre par chiffre
  decompte: ['1…', '2…', '3 !'],

  // Le nom de chaque coup (même clé que dans regles.js)
  noms: {
    pierre: 'Pierre', feuille: 'Feuille', ciseaux: 'Ciseaux',
    stylo: 'Stylo', glu: 'Super Glu', eau: 'Pistolet à eau', ballon: 'Ballon'
  },

  // La phrase qui explique le résultat, rangée par « gagnant-perdant »
  actions: {
    'ciseaux-feuille': 'Les ciseaux coupent la feuille !',
    'pierre-ciseaux': 'La pierre casse les ciseaux !',
    'feuille-pierre': 'La feuille enveloppe la pierre !',
    'stylo-feuille': 'Le stylo écrit une blague sur la feuille !',
    'pierre-stylo': 'La pierre écrase le stylo !',
    'ciseaux-stylo': 'Les ciseaux coupent le stylo !',
    'glu-pierre': 'La Super Glu colle la pierre !',
    'glu-feuille': 'La Super Glu colle la feuille !',
    'glu-ciseaux': 'La Super Glu colle les ciseaux !',
    'eau-feuille': 'Le pistolet à eau détrempe la feuille !',
    'eau-ciseaux': 'Le pistolet à eau fait rouiller les ciseaux !',
    'pierre-eau': "L'eau glisse sur la pierre !",
    'ballon-feuille': "Le ballon s'envole avec la feuille !",
    'ciseaux-ballon': 'Les ciseaux font éclater le ballon !'
  },
  egalite: 'Égalité !',

  // Fin de partie
  victoirePartie: 'Championne !',
  defaitePartie: "L'ordi gagne… pour cette fois !",
  defaiteEnLigne: 'Ton adversaire gagne… pour cette fois !',

  // Phrases fabriquées avec des chiffres
  scoreFin: (moi, adv, nomAdv, manches) => `Toi ${moi} – ${adv} ${nomAdv} (${manches} manches)`,
  record: (n) => `Record : ${n} ${n > 1 ? 'parties gagnées' : 'partie gagnée'} d'affilée`,

  // Les 15 blagues du stylo (écrites à la main sur la feuille)
  blagues: [
    "Comment appelle-t-on les parents de l'homme invisible ? Les transparents.",
    'Comment appelle-t-on une chauve-souris avec une perruque ? Une souris.',
    "C'est l'histoire de 2 patates qui traversent la route. L'une se fait écraser, l'autre dit : « Oh purée ! »",
    "Pourquoi un chasseur emmène-t-il son fusil aux toilettes ? Pour tirer la chasse.",
    'Que fait un crocodile quand il rencontre une superbe femelle ? Il Lacoste.',
    "Quelle est la plus intelligente : la blonde, la rousse ou la brune ? La rousse, parce que c'est un dictionnaire.",
    'Que fait une fraise sur un cheval ? Tagada tagada !',
    "Qu'est-ce qui n'est pas un steak ? Une pastèque.",
    "Pourquoi les canards sont toujours à l'heure ? Parce qu'ils sont dans l'étang.",
    'Que dit un zéro à un huit ? « Jolie ceinture ! »',
    'Comment appelle-t-on un boomerang qui ne revient pas ? Un bâton.',
    "Qu'est-ce qui est vert et qui monte et descend ? Un petit pois dans un ascenseur.",
    "Que dit une noisette quand elle tombe à l'eau ? « Je me noix ! »",
    "Pourquoi Napoléon n'a jamais acheté de maison ? Parce qu'il avait déjà un Bonaparte.",
    "Que dit une imprimante dans l'eau ? « J'ai papier ! »"
  ]
};

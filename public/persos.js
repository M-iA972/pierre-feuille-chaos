// =============================================================
// persos.js — Les dessins kawaii (SVG) de chaque coup, avec un visage
// Chaque dessin contient TOUTES les expressions du visage ;
// le CSS n'affiche que celle demandée par l'attribut data-humeur :
// normal, fier, peur, sonne (sonné) ou etonne (étonné).
// =============================================================

// Le visage commun à tous les objets, centré sur (x, y), à la taille t
function visage(x, y, t) {
  return `
  <g class="visage" transform="translate(${x} ${y}) scale(${t})">
    <ellipse class="joue" cx="-17" cy="5" rx="4.5" ry="2.8"/>
    <ellipse class="joue" cx="17" cy="5" rx="4.5" ry="2.8"/>
    <!-- yeux normaux (ils clignent sur les boutons) -->
    <g class="yeux normal">
      <ellipse cx="-10" cy="-3" rx="3.2" ry="4.4"/><ellipse cx="10" cy="-3" rx="3.2" ry="4.4"/>
      <circle class="reflet" cx="-9" cy="-5" r="1.2"/><circle class="reflet" cx="11" cy="-5" r="1.2"/>
    </g>
    <!-- yeux fiers : deux petits arcs « ^ ^ » -->
    <path class="yeux fier trait" d="M-14 -2 Q-10 -8 -6 -2 M6 -2 Q10 -8 14 -2"/>
    <!-- yeux grands ouverts (peur, étonnement) -->
    <g class="yeux ronds">
      <circle class="blanc" cx="-10" cy="-4" r="6.5"/><circle class="blanc" cx="10" cy="-4" r="6.5"/>
      <circle cx="-10" cy="-4" r="2.3"/><circle cx="10" cy="-4" r="2.3"/>
    </g>
    <!-- yeux en spirale (sonné) -->
    <path class="yeux spirale trait" d="M-10 -4 a1.5 1.5 0 1 1 1.5 1.5 a3 3 0 1 1 -3 -3 a4.5 4.5 0 1 1 4.5 4.5
      M10 -4 a1.5 1.5 0 1 1 1.5 1.5 a3 3 0 1 1 -3 -3 a4.5 4.5 0 1 1 4.5 4.5"/>
    <!-- les bouches -->
    <path class="bouche sourire trait" d="M-5 6 Q0 10.5 5 6"/>
    <path class="bouche fiere" d="M-7.5 5 Q0 15 7.5 5 Z"/>
    <ellipse class="bouche grand-o" cx="0" cy="9" rx="4" ry="5"/>
    <ellipse class="bouche petit-o" cx="0" cy="8" rx="2.4" ry="3"/>
    <path class="bouche vague trait" d="M-7 8 q1.75 -3 3.5 0 t3.5 0 t3.5 0 t3.5 0"/>
    <!-- goutte de sueur (peur) -->
    <path class="goutte" d="M19 -14 q4 6 0 8 q-4 -2 0 -8z"/>
  </g>`;
}

// Le corps de chaque objet (dessiné dans un carré de 100 × 100)
const CORPS = {
  // Un gros caillou arrondi
  pierre: `
    <path class="contour" fill="#D9D2E6" d="M16 72 Q8 48 26 32 Q42 16 64 22 Q88 30 91 56 Q94 80 70 86 L32 86 Q18 84 16 72Z"/>
    <circle cx="30" cy="46" r="3" fill="#BEB5CF"/><circle cx="78" cy="42" r="2.5" fill="#BEB5CF"/>
    ${visage(53, 60, 1)}`,

  // Une feuille de papier avec un coin plié
  feuille: `
    <path class="contour" fill="#FDFBFF" d="M22 10 H62 L80 28 V90 H22Z"/>
    <path class="contour" fill="#E9E3F5" d="M62 10 V28 H80Z"/>
    <path d="M30 26 H52 M30 36 H70" stroke="#BDE0FE" stroke-width="3" stroke-linecap="round"/>
    ${visage(51, 62, 1)}`,

  // Des ciseaux : deux lames, deux anneaux roses, le visage sur la vis du milieu
  ciseaux: `
    <path class="contour" fill="#EEF3FA" d="M44 58 L20 10 Q26 4 32 9 L57 52Z"/>
    <path class="contour" fill="#EEF3FA" d="M56 58 L80 10 Q74 4 68 9 L43 52Z"/>
    <circle cx="31" cy="82" r="11" fill="none" stroke="#4A4063" stroke-width="12"/>
    <circle cx="31" cy="82" r="11" fill="none" stroke="#FFB3CF" stroke-width="6"/>
    <circle cx="69" cy="82" r="11" fill="none" stroke="#4A4063" stroke-width="12"/>
    <circle cx="69" cy="82" r="11" fill="none" stroke="#FFB3CF" stroke-width="6"/>
    <circle class="contour" cx="50" cy="58" r="18" fill="#CDB4DB"/>
    ${visage(50, 59, 0.75)}`,

  // Un stylo penché : capuchon violet, corps bleu, pointe jaune
  stylo: `
    <g transform="rotate(25 50 50)">
      <path class="contour" fill="#FFF1A8" d="M38 70 L62 70 L50 96Z"/>
      <path fill="#4A4063" d="M46 87 L54 87 L50 96Z"/>
      <rect class="contour" x="36" y="14" width="28" height="60" rx="10" fill="#BDE0FE"/>
      <rect class="contour" x="36" y="6" width="28" height="18" rx="8" fill="#CDB4DB"/>
      ${visage(50, 48, 0.8)}
    </g>`,

  // Un flacon de Super Glu
  glu: `
    <path class="contour" fill="#FFF1A8" d="M45 4 L55 4 L53 20 L47 20Z"/>
    <rect class="contour" x="37" y="18" width="26" height="14" rx="5" fill="#FFC8DD"/>
    <rect class="contour" x="20" y="30" width="60" height="64" rx="18" fill="#FFFBEA"/>
    <path fill="#FFF1A8" d="M22 72 Q50 64 78 72 V76 Q78 92 62 92 H38 Q22 92 22 76Z"/>
    ${visage(50, 56, 0.95)}`,

  // Un pistolet à eau : réservoir rose, canon et poignée bleus
  eau: `
    <circle class="contour" cx="66" cy="20" r="11" fill="#FFC8DD"/>
    <path class="contour" fill="#BDE0FE" d="M52 50 L76 50 L84 88 Q85 93 79 93 L66 93 Q62 93 61 89Z"/>
    <rect class="contour" x="4" y="35" width="16" height="14" rx="4" fill="#CDB4DB"/>
    <rect class="contour" x="14" y="24" width="74" height="36" rx="18" fill="#BDE0FE"/>
    ${visage(46, 42, 0.85)}`,

  // Un ballon rose avec sa ficelle
  ballon: `
    <path d="M50 74 Q43 84 52 90 Q60 95 50 100" fill="none" stroke="#4A4063" stroke-width="2"/>
    <path class="contour" fill="#FF9FB6" d="M44 78 L56 78 L50 68Z"/>
    <ellipse class="contour" cx="50" cy="40" rx="30" ry="33" fill="#FFB3C7"/>
    <ellipse cx="37" cy="24" rx="5" ry="9" fill="#FFFFFF" opacity="0.6" transform="rotate(-25 37 24)"/>
    ${visage(50, 44, 1)}`
};

// Renvoie le dessin SVG complet d'un coup
function dessin(coup) {
  return `<svg class="dessin" viewBox="0 0 100 100" aria-hidden="true">${CORPS[coup]}</svg>`;
}

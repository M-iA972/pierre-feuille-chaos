# Liste de tests — Pierre Feuille Chaos

À faire sur ordinateur **et** sur téléphone, avec le lien Render.
Astuce : pour forcer un cas précis, ouvrir la console (Cmd+Option+J) et taper par exemple `etat.coupOrdi = 'feuille'` avant de cliquer, ou `nouvelleManche('glu')` pour faire apparaître un bonus.

## Le jeu solo

- [ ] Ouvrir le lien : l'accueil s'affiche, la carte est centrée, sans erreur dans la console.
- [ ] « Contre l'ordi » : score 0 – 0, « ? VS ? » au milieu, 3 boutons avec des personnages qui clignent des yeux.
- [ ] Cliquer sur Pierre : les boutons se grisent, « 1… 2… 3 ! » s'affiche en gros au centre (environ 1,5 s).
- [ ] Au « 3 ! », les deux personnages apparaissent : le mien à gauche, celui de l'ordi à droite.
- [ ] Le perdant a peur (yeux ronds, bouche en O), puis au choc il est sonné (yeux en spirale) ; le gagnant prend un air fier.
- [ ] Au choc : la carte tremble, des paillettes pastel jaillissent, un bruitage se joue.
- [ ] Égalité : les deux ont l'air étonnés, se cognent, « Égalité ! », personne ne marque.
- [ ] Après l'animation, les deux coups restent visibles à leur place, le perdant grisé.
- [ ] Pierre contre Ciseaux : « La pierre casse les ciseaux ! », un cœur se remplit.
- [ ] Ciseaux contre Feuille : « Les ciseaux coupent la feuille ! ».
- [ ] Feuille contre Pierre : « La feuille enveloppe la pierre ! ».
- [ ] Sous les boutons, l'historique ajoute une manche : mon coup / son coup + pastille verte (gagné), rouge (perdu) ou grise (égalité).
- [ ] Cliquer 5 fois très vite : une seule manche est jouée.
- [ ] La partie s'arrête exactement à 3 points.
- [ ] Partie gagnée : « Championne ! » et des confettis. Partie perdue : « L'ordi gagne… pour cette fois ! » et la carte tremble.
- [ ] « Revanche ? » : tout repart à 0 (score, cœurs, étoiles, historique), sans recharger la page.
- [ ] « Accueil » en pleine partie : retour à l'accueil proprement.
- [ ] Gagner une partie, recharger la page : le record est toujours affiché.
- [ ] Aucune voix ne parle, nulle part.

## Les bruitages

- [ ] Ciseaux gagnants : « tchac ». Pierre : « boum ». Feuille : « flap ». Ballon qui éclate : « pop ». Pistolet à eau : « splash ». Super Glu : « sploutch ».
- [ ] Le bouton 🔊 en haut à droite passe à 🔇 et coupe tous les bruitages ; un nouveau clic les remet.

## Les bonus

- [ ] Sur 10 manches, un bonus apparaît environ 5 fois, en 4e bouton rond avec l'étiquette « Outil bonus ».
- [ ] Il n'y a jamais de Radio ni de Dé.
- [ ] Ne pas jouer le bonus : il disparaît, et la manche suivante fait un nouveau tirage.
- [ ] Stylo contre feuille : je gagne, une blague s'écrit lettre par lettre ; contre pierre / ciseaux : je perds, le stylo reste reconnaissable.
- [ ] Super Glu contre pierre, feuille, ciseaux : je gagne à chaque fois, le coup d'en face est collé.
- [ ] Pistolet à eau : gagne contre feuille (détrempée) et ciseaux (rouillés), perd contre pierre (l'eau glisse).
- [ ] Ballon : gagne contre feuille (envol), égalité contre pierre (rebond), perd contre ciseaux (éclate).

## Les infobulles de règles

- [ ] Plus aucun texte de règles sous les boutons.
- [ ] Ordinateur : survoler Pierre affiche « 🪨 > ✂️ | 🪨 < 📄 » au-dessus du bouton, avec une flèche.
- [ ] Même chose pour Feuille, Ciseaux et le bonus (ex. Ballon : « 🎈 > 📄 | 🎈 < ✂️ | 🎈 = 🪨 »).
- [ ] Téléphone : un appui long sur un bouton affiche l'infobulle, sans jouer le coup ; un appui court joue.

## L'affichage

- [ ] Ordinateur : carte d'environ 720 px, centrée en hauteur et en largeur, gros personnages.
- [ ] Téléphone (ou 360 px) : boutons les uns sous les autres, aucun défilement horizontal.

## Jouer en ligne (deux fenêtres, ou deux appareils avec le lien Render)

- [ ] Accueil : « Jouer en ligne » est sous « Contre l'ordi ». Il n'y a plus de code d'invitation nulle part.
- [ ] Fenêtre 1 seule : « Jouer en ligne » → « Recherche d'une adversaire… » avec les personnages qui sautillent ; ça reste affiché tant que personne n'arrive.
- [ ] « Annuler » ramène à l'accueil.
- [ ] « Jouer contre l'ordi » lance une partie solo ; une 2e fenêtre qui cherche ensuite reste en recherche (la 1re n'est plus dans la file).
- [ ] Fenêtre 1 et fenêtre 2 cliquent sur « Jouer en ligne » : la partie démarre toute seule dans les deux.
- [ ] L'adversaire s'appelle « Adversaire » (score, duel, écran de fin).
- [ ] La première qui joue voit « En attente de ton adversaire… » ; l'autre ne voit pas son choix.
- [ ] Le décompte démarre seulement quand les deux ont choisi.
- [ ] Le score est le même (inversé) sur les deux écrans à chaque manche.
- [ ] Chacune peut recevoir son propre bonus ; bonus contre bonus = égalité.
- [ ] Fin : « Championne ! » chez la gagnante, « Ton adversaire gagne… pour cette fois ! » chez l'autre, avec « Revanche ? », « Nouvelle adversaire » et « Accueil ».
- [ ] En solo, le bouton « Nouvelle adversaire » n'apparaît pas.
- [ ] « Revanche ? » d'un seul côté : « En attente de ton adversaire… » ; quand les deux ont cliqué, la partie repart à 0 – 0.
- [ ] « Nouvelle adversaire » : retour à « Recherche d'une adversaire… » ; l'autre voit « Ton adversaire a quitté la partie. ».
- [ ] Fermer une fenêtre en pleine partie : l'autre voit « Ton adversaire a quitté la partie. » et un bouton « Accueil ».

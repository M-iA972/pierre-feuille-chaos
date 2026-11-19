# Comprendre mon code — Pierre Feuille Chaos

## Le rôle de chaque fichier

| Fichier | En une phrase |
|---|---|
| `server.js` | Sert les fichiers du jeu ; en ligne, garde une file d'attente, forme les paires et arbitre les manches. |
| `package.json` | Carte d'identité du projet : nom, commande `npm start`, dépendances (express, socket.io). |
| `public/index.html` | La page unique : chaque écran est une `<section>` qu'on montre ou qu'on cache. |
| `public/style.css` | Les couleurs, l'adaptation au téléphone, les expressions des visages et toutes les animations. |
| `public/regles.js` | L'objet « qui bat qui » et les fonctions de tirage et de jugement, partagés avec le serveur. |
| `public/contenus.js` | Tous les textes du jeu. |
| `public/persos.js` | Les dessins SVG kawaii de chaque coup, avec toutes leurs expressions. |
| `public/script.js` | Le déroulement d'une partie, l'affichage, les bruitages et les animations. |
| `public/online.js` | Envoie les clics au serveur en mode « Jouer en ligne » et affiche ses réponses. |
| `.gitignore` | Dit à Git de ne pas envoyer `node_modules/` (qui se réinstalle avec `npm install`), ni `.env` ni `.DS_Store`. |

## Les fonctions

### regles.js
- `estBonus(coup)` : dit si un coup est un bonus.
- `coupAuHasard()` : le choix de l'ordi, pierre, feuille ou ciseaux au hasard.
- `tirerBonus()` : tire un bonus en tenant compte des chances (Super Glu 10 %, les trois autres 30 %).
- `bonusDeLaManche()` : une chance sur deux d'avoir un bonus.
- `jugerManche(a, b)` : dit si « a » gagne, perd ou fait égalité contre « b ».

### persos.js
- `visage(x, y, t)` : dessine un visage avec toutes ses expressions (le CSS n'en montre qu'une).
- `dessin(coup)` : renvoie le dessin SVG complet d'un coup.

### script.js
- `remplirTextes()` : met les textes, les dessins et les règles des boutons dans la page.
- `reglesEnSymboles(coup)` : fabrique l'infobulle, ex. « 🎈 > 📄 | 🎈 < ✂️ | 🎈 = 🪨 ».
- `afficherEcran(nom)` : montre un écran, cache les autres.
- `reveillerSon()` : allume le synthétiseur du navigateur après un clic.
- `note(...)`, `souffle(...)` : fabriquent un son (une note qui glisse, un bruit filtré).
- `bruitage(nom)` : joue un bruitage de la liste `BRUITAGES` (tchac, boum, flap, pop, splash, sploutch…).
- `basculerSon()` : bouton 🔊 / 🔇.
- `lireRecord()`, `enregistrerRecord(n)`, `afficherRecord()` : le record dans le localStorage.
- `arreterTout()` : arrête la manche en cours.
- `demarrerPartie(mode)` : remet tout à zéro et lance une partie.
- `nouvelleManche(bonus)` : l'ordi choisit son coup, le bonus s'affiche, les boutons se débloquent.
- `verrouiller(oui)` : bloque ou débloque les boutons.
- `preparerArene()` : remet « ? VS ? » et efface l'animation précédente.
- `afficherCentre(texte, classe)` : écrit « VS » ou un chiffre du décompte au milieu.
- `jouerCoup(coup)` : ce qui se passe au clic sur un coup.
- `jouerManche(moi, adv, resultat)` : décompte, révélation, animation, résultat, puis la suite.
- `montrerCoup(el, coup)`, `humeur(el, expression)` : dessinent un coup et changent son expression.
- `gagnantPerdant(...)` : range les deux coups dans l'ordre gagnant / perdant.
- `afficherResultat(...)` : compte le point et affiche la phrase qui explique.
- `ajouterHistorique(...)` : ajoute une manche à la ligne d'historique.
- `dessinerScore(issue)`, `remplirJauge(...)` : le score, les cœurs et les étoiles.
- `finDePartie()` : l'écran de fin, le record, les confettis ou la secousse.
- `revanche()` et `allerAccueil()` : les boutons de fin et de retour.
- `choisirAction(...)`, `animer(...)` : choisissent et lancent l'animation, puis le choc.
- `pointDeContact(...)` : calcule où les paillettes jaillissent.
- `couperEnDeux`, `ecrireBlague`, `paillettes`, `particules`, `pluieDeConfettis`, `secouer` : les effets spéciaux.
- `brancherAppuiLong()` : l'infobulle par appui long sur téléphone.

### online.js
- `chercherAdversaire()` : se connecte au serveur et entre dans la file d'attente (« Jouer en ligne », « Nouvelle adversaire »).
- `brancherSocket()` : dit quoi faire pour chaque message du serveur.
- `montrerDepart()` : affiche « Ton adversaire a quitté la partie ».
- `envoyerCoupEnLigne(coup)` : envoie mon coup au serveur.
- `demanderRevanche()` : dit au serveur que je veux la revanche.
- `quitterEnLigne()` : sort de la file d'attente ou quitte la partie.

### server.js
- `commencerPartie(partie)` : remet les scores à zéro et envoie à chacune son premier bonus.
- `creerPartie(a, b)` : met deux joueuses ensemble dans une nouvelle partie.
- `estFinie(partie)` : vrai si quelqu'un a 3 points.
- `jugerEtEnvoyer(partie)` : juge la manche et envoie le résultat à chacune, de son point de vue.
- `quitter(socket)` : retire une joueuse de la file d'attente et de sa partie, et prévient l'autre.

## Le trajet d'un clic (mode solo)

1. Au début de la manche, `nouvelleManche` a déjà tiré le coup de l'ordi (`etat.coupOrdi`).
2. Je clique sur Ciseaux → `jouerCoup('ciseaux')`.
3. Si `etat.verrou` est vrai, on ignore le clic (protection contre le double clic). Sinon on verrouille.
4. `jugerManche('ciseaux', 'feuille')` lit `REGLES.ciseaux.contre.feuille` → `'gagne'`.
5. `jouerManche` affiche « 1… », « 2… », puis « 3 ! » et dessine les deux personnages.
6. `animer` met la feuille en mode « peur » et la classe `anim-coupe` sur l'arène : le CSS fait avancer les ciseaux.
7. À 0,45 s, c'est le choc : bruitage « tchac », paillettes, secousse, la feuille est coupée et sonnée, les ciseaux sont fiers.
8. À 1,3 s, la classe `fini` remet chacun à sa place (le perdant grisé). « Les ciseaux coupent la feuille ! » s'affiche, un cœur se remplit, l'historique s'allonge.
9. 2,2 s plus tard : fin de partie si quelqu'un a 3 points, sinon `nouvelleManche`.

En ligne, l'étape 4 se passe sur le serveur : `jouerCoup` appelle `envoyerCoupEnLigne`, et quand les deux ont joué, le serveur renvoie `resultat` et `online.js` appelle `jouerManche`.

## Comment marchent les visages ?

Chaque dessin contient toutes les expressions à la fois (yeux normaux, fiers, ronds, en spirale ; plusieurs bouches). Le CSS les cache toutes, sauf celles qui correspondent à l'attribut `data-humeur` du personnage. Changer d'expression, c'est donc juste changer cet attribut : `humeur(el, 'sonne')`.

## Où est stocké l'état de la partie ?

- **Solo** : dans l'objet `etat` de `script.js`, en mémoire dans le navigateur. Recharger la page efface la partie. Seul le record reste, dans le `localStorage`.
- **En ligne** : le serveur garde la joueuse qui attend dans `enAttente`, et chaque joueuse connectée retient sa partie dans `socket.data.partie`. Tout est en mémoire, pas de base de données.
- **Si le serveur redémarre** (mise à jour, veille de Render) : toutes les parties en ligne et la file d'attente sont perdues. Les joueuses voient « Ton adversaire a quitté la partie » et relancent une recherche. Le mode solo n'est pas touché.

## Le `jeton` : arrêter une partie proprement

`jouerManche` attend plusieurs fois (décompte, animation). Si je clique sur « Accueil » pendant ces attentes, `arreterTout()` augmente `etat.jeton`. Après chaque attente, la manche compare son jeton au jeton actuel : s'ils sont différents, elle s'arrête sans rien afficher.

## 5 questions probables du formateur

**1. Comment es-tu sûre que l'ordi ne triche pas ?**
Son coup est tiré par `coupAuHasard()` dans `nouvelleManche`, avant mon clic. `jouerCoup` utilise ce coup tel quel, rien ne le modifie ensuite.

**2. Comment ajouterais-tu un nouveau bonus ?**
Une ligne dans l'objet `REGLES` (emoji, chance, résultat contre pierre, feuille, ciseaux), son nom et ses phrases dans `contenus.js`, son dessin dans `persos.js`. Le tirage, le jugement, le serveur et l'infobulle s'en servent automatiquement.

**3. Comment le serveur trouve-t-il une adversaire ?**
Il garde une file d'attente d'une seule place, `enAttente`. Quand une joueuse clique sur « Jouer en ligne », soit la place est vide et elle y attend, soit quelqu'un attend déjà et le serveur les met ensemble avec `creerPartie`. « Annuler » ou « Jouer contre l'ordi » envoie `quitter`, qui libère la place.

**4. En ligne, une joueuse peut-elle tricher en modifiant le JavaScript ?**
Non : c'est le serveur qui tire les bonus, vérifie que le coup reçu est autorisé (un coup de base ou le bonus qu'il a donné), refuse un deuxième coup et juge la manche. Le choix de l'autre n'est envoyé qu'au moment du résultat.

**5. D'où viennent les bruitages, puisqu'il n'y a aucun fichier son ?**
Ils sont fabriqués par le navigateur avec Web Audio : `note` produit une note qui glisse (le « boum » de la pierre), `souffle` produit un bruit filtré (le « tchac » des ciseaux). Le navigateur n'autorise le son qu'après un clic : c'est le rôle de `reveillerSon()`.

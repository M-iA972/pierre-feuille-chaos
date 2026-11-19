# Pierre Feuille Chaos

Un pierre-feuille-ciseaux drôle et mignon, jouable dans le navigateur. Les coups sont des petits personnages kawaii qui ont peur, prennent un air fier ou finissent sonnés. Quatre outils bonus farfelus (Stylo, Super Glu, Pistolet à eau, Ballon) pimentent les manches. La première à 3 points gagne.

- **Contre l'ordi** : l'ordi joue au hasard, sans tricher.
- **Jouer en ligne** : le serveur trouve automatiquement une adversaire parmi les joueuses qui cherchent en même temps.

## Lancer le jeu en local

```bash
npm install
npm start
```

Ouvrir ensuite http://localhost:3000.

Le mode solo marche aussi en ouvrant directement `public/index.html`, sans serveur. Le bouton « Jouer en ligne » affiche alors « Bientôt disponible » : pour le mode en ligne, il faut passer par le serveur (http://localhost:3000).

## Tester le mode en ligne avec deux fenêtres

1. `npm start` (laisser le terminal ouvert).
2. Fenêtre 1 : ouvrir http://localhost:3000 → « Jouer en ligne ». L'écran « Recherche d'une adversaire… » s'affiche.
3. Fenêtre 2 : une **autre fenêtre** (Cmd+N, pas un onglet) sur http://localhost:3000 → « Jouer en ligne ».
4. Les deux fenêtres passent toutes seules à la partie. Les mettre côte à côte et jouer un coup dans chacune.

Pour tester depuis un téléphone sur le même Wi-Fi, remplacer `localhost` par l'adresse IP du Mac (Réglages Système → Wi-Fi → Détails).

## Les fichiers

| Fichier | Rôle |
|---|---|
| `server.js` | Serveur Express (sert `public/`) + Socket.IO : file d'attente et arbitrage en ligne |
| `public/index.html` | Tous les écrans du jeu |
| `public/style.css` | Design « bonbon chaleureux », mobile, expressions des visages, animations |
| `public/regles.js` | L'objet « qui bat qui » : toutes les règles (partagé avec le serveur) |
| `public/contenus.js` | Tous les textes |
| `public/persos.js` | Les dessins SVG kawaii de chaque coup, avec leur visage |
| `public/script.js` | Le jeu solo, l'affichage, les bruitages et les animations |
| `public/online.js` | Le mode « Jouer en ligne » côté navigateur |

Aucun fichier son : les bruitages sont fabriqués par le navigateur (Web Audio).

## Ajouter un bonus

1. Ajouter une ligne dans `REGLES` (`public/regles.js`) : emoji, chance, résultat contre pierre, feuille, ciseaux.
2. Ajouter son nom dans `TEXTES.noms` et ses phrases dans `TEXTES.actions` (`public/contenus.js`).
3. Ajouter son dessin dans `CORPS` (`public/persos.js`), et son animation dans `ACTIONS` (`public/script.js`).

L'infobulle des règles se fabrique toute seule à partir de `REGLES`.

## Mettre en ligne

**GitHub** (compte M-iA972, dépôt `pierre-feuille-chaos`) :

```bash
git add .
git commit -m "Pierre Feuille Chaos"
git branch -M main
git remote add origin https://github.com/M-iA972/pierre-feuille-chaos.git
git push -u origin main
```

**Render** :

1. render.com → New → Web Service → choisir le dépôt `pierre-feuille-chaos`.
2. Build Command : `npm install` ; Start Command : `npm start` ; offre : Free.
3. Attendre « Live » puis ouvrir l'adresse en `.onrender.com`.

Render met le service gratuit en veille après 15 minutes sans visite, et le réveil prend environ une minute. Il faut donc ouvrir le lien quelques minutes avant la présentation.

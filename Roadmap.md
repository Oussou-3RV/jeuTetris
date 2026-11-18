# Roadmap – Projet Tetris

Équipe : Ousmane Balde, Yacine Doudou
Stack : TypeScript, Phaser 3, Vite, Node.js + Express, SQLite (`node:sqlite`), Vitest, Git/GitHub

**Comment utiliser ce fichier** : on coche `[x]` chaque tâche terminée. On avance une étape à la fois, et on ne passe à la suivante que quand le critère « Terminé quand » est rempli. Ce fichier est lui-même versionné dans Git : on le met à jour dans nos commits.

---

## L'idée directrice (à retenir)

On sépare le projet en deux mondes :

1. **La logique du jeu** (grille, pièces, collisions, lignes, score, niveaux) en TypeScript pur, sans Phaser. Elle ne sait pas dessiner.
2. **L'affichage** (Phaser) qui lit l'état de la logique et le dessine.

**Pourquoi ?** Une logique pure se teste facilement avec des tests unitaires (pas besoin de navigateur ni d'écran). C'est là que se trouvent presque toutes les règles de la proposition, donc c'est là qu'on met presque tous nos tests. Phaser devient une « couche mince » par-dessus.

Structure visée du dépôt :

```
tetris/
├─ package.json            (workspaces npm)
├─ roadmap.md
├─ README.md
├─ .github/workflows/ci.yml
├─ client/                 (Vite + Phaser + TypeScript)
│  └─ src/
│     ├─ game/             (logique pure, testée)
│     ├─ scenes/           (Phaser : Menu, Jeu, Pause, FinDePartie, Tableau)
│     └─ api/              (appels au serveur)
└─ server/                 (Express + SQLite)
   └─ src/
```

---

## Étape 0 – Préparer son poste

**Pourquoi** : éviter de perdre du temps plus tard avec des erreurs d'environnement.

- [x] Lire la proposition de projet (PDF) et comprendre les règles
- [ ] Installer / vérifier **Node.js** (version LTS actuelle, 24 ou plus) : `node -v`
- [ ] Vérifier que `node:sqlite` existe : `node -e "require('node:sqlite'); console.log('ok')"`
- [ ] Installer / vérifier **Git** : `git --version`
- [ ] Avoir un éditeur (VS Code) et un compte GitHub
- [ ] Configurer Git (nom + courriel) : `git config --global user.name "..."` et `user.email "..."`

**Terminé quand** : les 3 commandes de vérification répondent sans erreur.

---

## Étape 1 – GitHub : le dépôt et la façon de travailler à deux

**Pourquoi** : GitHub est la source de vérité du code. Si on met en place de bonnes habitudes dès le début (branches, pull requests), on évite les conflits et on garde un historique propre, utile pour le cours de génie logiciel.

- [ ] Créer le dépôt `tetris` sur GitHub (avec `.gitignore` Node et licence au choix)
- [ ] Ajouter l'autre coéquipier comme collaborateur (Settings > Collaborators)
- [ ] Cloner le dépôt sur l'ordinateur
- [ ] Écrire un premier `README.md` (description du projet, comment lancer)
- [ ] Décider de nos règles de travail :
  - `main` = toujours stable, on n'y pousse jamais directement
  - une branche par tâche : `feature/grille`, `feature/score`, etc.
  - on fusionne par **Pull Request** relue par l'autre personne
  - messages de commit courts et clairs (ex. `feat: ajoute la détection de collision`)
- [ ] Activer la protection de `main` (exiger une PR) – Settings > Branches
- [ ] Créer des **Issues** à partir de ce roadmap (une par étape) et un petit tableau Projects (À faire / En cours / Terminé)

**Terminé quand** : les deux coéquipiers ont cloné le dépôt, et un premier commit passe par une branche + une PR.

---

## Étape 2 – Squelette du projet (TypeScript, Vite, Vitest)

**Pourquoi** : Vite compile le TypeScript et sert le jeu en développement ; Vitest est l'outil de tests qui s'intègre naturellement à Vite (même configuration, très rapide).

- [ ] Initialiser `package.json` à la racine avec les **workspaces** (`client`, `server`)
- [ ] Créer le projet `client` avec Vite (gabarit `vanilla-ts`)
- [ ] Installer Phaser 3 dans `client`
- [ ] Installer **Vitest** dans `client` et écrire **un tout premier test bidon** (ex. `1 + 1 = 2`) pour valider la chaîne
- [ ] Configurer `tsconfig.json` en mode strict
- [ ] Ajouter les scripts : `dev`, `build`, `test`
- [ ] (Optionnel) ESLint + Prettier pour un code uniforme entre nous deux
- [ ] Vérifier que `npm run dev` affiche une page et que `npm test` passe

**Terminé quand** : la page de départ s'affiche et le test bidon passe.

---

## Étape 3 – Intégration continue (GitHub Actions)

**Pourquoi** : à chaque push / PR, GitHub lance automatiquement les tests. Personne ne peut fusionner du code qui casse les tests sans que ça se voie.

- [ ] Créer `.github/workflows/ci.yml` (installer, build, lancer les tests)
- [ ] Vérifier qu'une PR affiche la coche verte ✅ (ou la croix rouge ❌)
- [ ] Exiger que la CI passe avant de fusionner (protection de `main`)

**Terminé quand** : une PR déclenche la CI et elle passe au vert.

---

## Étape 4 – La logique du jeu (TDD, le cœur du projet)

**Pourquoi** : c'est le plus gros du travail et le plus important à tester. On utilise le **TDD** : on écrit d'abord un test qui échoue (rouge), puis le code minimal pour le faire passer (vert), puis on nettoie (refactor). Chaque règle de la section 1.1 de la proposition devient un ou plusieurs tests.

Dossier : `client/src/game/` — **aucun import de Phaser ici**.

### 4.1 Les pièces (tétrominos)
- [ ] Définir les 7 pièces (I, O, T, S, Z, J, L) et leurs formes
- [ ] Fonction de rotation (sens horaire)
- [ ] Tests : chaque pièce a 4 carrés, 4 rotations ramènent à la forme de départ, la pièce O ne change pas

### 4.2 La grille (10 × 20)
- [ ] Créer une grille vide de 10 colonnes × 20 lignes
- [ ] Fonction « est-ce que cette pièce, à cette position, entre en collision ? » (mur gauche/droit, fond, blocs déjà posés)
- [ ] Fonction pour **figer** une pièce dans la grille
- [ ] Tests : collisions sur chaque bord, collision avec un bloc, grille vide au départ

### 4.3 Déplacements
- [ ] Gauche / droite (refusés si collision)
- [ ] Rotation (refusée ou ajustée simplement si collision)
- [ ] Chute d'un rang (soft drop) et **chute instantanée** (hard drop)
- [ ] Tests : un déplacement bloqué ne change rien, le hard drop s'arrête sur le fond ou sur une pile

### 4.4 Verrouillage et apparition des pièces
- [ ] Quand la pièce ne peut plus descendre : elle se fige, une nouvelle apparaît en haut
- [ ] Génération **aléatoire** des pièces, avec un générateur aléatoire **injectable** (pour pouvoir le contrôler dans les tests)
- [ ] La « prochaine pièce » est toujours connue à l'avance
- [ ] Tests : la prochaine pièce devient la pièce courante, avec un générateur fixé le résultat est prévisible

### 4.5 Lignes complètes
- [ ] Détecter les lignes pleines
- [ ] Les supprimer et faire descendre les blocs du dessus
- [ ] Tests : 1, 2, 3 et 4 lignes à la fois, lignes non adjacentes, rien ne se passe si aucune ligne n'est pleine

### 4.6 Score et niveaux
- [ ] Points : 1 ligne = 100, 2 = 300, 3 = 500, 4 = 800, **multipliés par le niveau**
- [ ] Niveau = monte de 1 toutes les 10 lignes éliminées
- [ ] Vitesse de chute qui augmente avec le niveau
- [ ] Tests : chaque barème, le passage au niveau 2 à 10 lignes, le multiplicateur de niveau

### 4.7 Fin de partie
- [ ] Fin quand une nouvelle pièce ne peut pas apparaître (collision à l'apparition)
- [ ] Tests : pile qui atteint le haut → fin de partie

### 4.8 La classe `Game` (le chef d'orchestre)
- [ ] Regrouper le tout : état du jeu, `tick()` (un pas de temps), commandes du joueur, pause
- [ ] Tests d'une partie complète simulée avec un générateur aléatoire fixé

**Terminé quand** : toutes les règles de la section 1.1 sont couvertes par des tests unitaires qui passent, sans avoir ouvert un navigateur.

---

## Étape 5 – L'interface avec Phaser

**Pourquoi** : maintenant que la logique est fiable, on la branche à l'écran. Phaser s'occupe de la boucle de jeu, du clavier, des sons et des scènes.

- [ ] Configurer Phaser (taille du canvas, scènes)
- [ ] **Scène Menu principal** : saisie d'un pseudo, boutons Jouer / Tableau d'honneur / Quitter
- [ ] **Scène Jeu** : dessiner la grille et la pièce courante à partir de l'état de `Game`
- [ ] Brancher le clavier : gauche, droite, rotation, accélérer, chute instantanée, pause
- [ ] Boucle de chute liée au niveau (la vitesse change avec le niveau)
- [ ] Affichage : prochaine pièce, score, niveau, lignes éliminées
- [ ] **Scène Pause** : reprendre / recommencer / retour au menu
- [ ] **Scène Fin de partie** : score final, rang, rejouer / menu
- [ ] **Sons** : rotation, ligne complétée, fin de partie + bouton muet
- [ ] Tests unitaires des petites fonctions utilitaires de l'interface (ex. conversion case de grille → pixels, validation du pseudo)

**Terminé quand** : on peut jouer une partie complète du début à la fin dans le navigateur (sans serveur).

---

## Étape 6 – Le serveur (Express + SQLite)

**Pourquoi** : le tableau d'honneur doit être partagé entre tous les joueurs, donc les scores sont stockés côté serveur dans un fichier SQLite.

- [ ] Créer le projet `server` (TypeScript + Express)
- [ ] Créer la base SQLite et la table `scores` (id, pseudo, score, niveau, lignes, date)
- [ ] Route `POST /api/scores` : enregistrer un score
- [ ] Route `GET /api/scores` : renvoyer les 10 meilleurs
- [ ] **Validation** des entrées (pseudo non vide et de longueur limitée, score entier positif et raisonnable) – on ne fait pas confiance au client
- [ ] Gérer le CORS (client Vite et serveur sur deux ports en développement)
- [ ] Tests unitaires de la couche base de données (avec une base SQLite **en mémoire**)
- [ ] Tests des routes avec **Supertest** (cas normal, entrées invalides, classement trié, limite de 10)

**Terminé quand** : le serveur démarre et tous ses tests passent.

---

## Étape 7 – Brancher le client au serveur

- [ ] Module `api/` dans le client : `envoyerScore()` et `obtenirClassement()`
- [ ] Scène Fin de partie : envoyer le score et afficher le rang obtenu
- [ ] Scène Tableau d'honneur : afficher les 10 meilleurs scores
- [ ] Gérer le cas où le serveur est inaccessible (message clair, le jeu reste jouable)
- [ ] Tests avec un faux `fetch` (mock) pour le module `api/`
- [ ] Configurer le proxy Vite pour éviter les soucis de CORS en développement

**Terminé quand** : un score joué apparaît dans le tableau d'honneur, même après un redémarrage du serveur.

---

## Étape 8 – Finitions et livraison

- [ ] Parcours manuel complet de tous les écrans (liste de vérification)
- [ ] Vérifier la couverture des tests (`vitest --coverage`) et combler les trous importants
- [ ] Corriger les bogues trouvés (une Issue par bogue)
- [ ] Mettre à jour le `README.md` (installation, lancement, tests, captures d'écran)
- [ ] Nettoyer le code et les branches
- [ ] Créer une **release / tag** GitHub de la version à remettre
- [ ] (Optionnel) Déploiement en ligne

**Terminé quand** : un nouveau clone du dépôt se lance en suivant seulement le README, et la CI est verte.

---

## Questions ouvertes (à régler ensemble)

- Dates de remise des prochaines phases du cours : à confirmer pour ajuster le rythme
- Le bouton **Quitter** dans un jeu web : que fait-il exactement ? (retour à l'écran du pseudo, message d'au revoir…)
- Génération des pièces : purement aléatoire, ou « sac de 7 » (chaque pièce une fois avant de recommencer) ? La proposition dit « ordre aléatoire »
- Courbe de vitesse selon les niveaux : à choisir (on en propose une à l'étape 4.6)
- Qui fait quoi entre nous deux (voir tableau ci-dessous)

## Répartition (à remplir)

| Étape | Responsable | Statut |
|-------|-------------|--------|
| 1 – GitHub | | À faire |
| 2 – Squelette | | À faire |
| 3 – CI | | À faire |
| 4 – Logique | | À faire |
| 5 – Phaser | | À faire |
| 6 – Serveur | | À faire |
| 7 – Intégration | | À faire |
| 8 – Finitions | | À faire |

## Journal d'avancement

- 2026-11-18 : lecture de la proposition, création du roadmap.
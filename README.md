# Bagarre.io

Un jeu de combat 2D simple où deux joueurs peuvent s'affronter sur un même clavier.

## Structure du projet

Le projet est organisé avec une architecture modulaire pour faciliter la maintenance et l'évolution du code :

```
bagarre.io/
├── index.html                # Page principale du jeu
├── styles/
│   └── main.css              # Styles CSS du jeu
├── js/
│   ├── constants.js          # Constantes et configurations
│   ├── utils.js              # Fonctions utilitaires (dessin, etc.)
│   ├── ui.js                 # Gestion de l'interface utilisateur
│   ├── player.js             # Classe Player
│   └── game.js               # Contrôleur principal du jeu
└── README.md                 # Documentation
```

## Comment jouer

1. Ouvrez le fichier `index.html` dans votre navigateur
2. Contrôles :
   - **Joueur 1** : Q (gauche), D (droite), Z (attaque)
   - **Joueur 2** : Flèches ← → (déplacement), ↑ (attaque)
3. Chaque joueur possède une barre de vie qui diminue quand il est touché
4. Le joueur qui réduit la vie de son adversaire à zéro gagne la partie

## Caractéristiques du jeu

- Animation fluide avec requestAnimationFrame
- Effets visuels lors des attaques
- Expressions faciales qui changent en fonction de la santé
- Système de recul lors des coups
- Animations de marche et clignement des yeux
- Indicateurs de dégâts

## Développement

Le jeu a été développé avec une architecture modulaire pour faciliter les améliorations. Pour ajouter de nouvelles fonctionnalités :

1. `constants.js` - Ajoutez de nouvelles constantes ou configurations
2. `player.js` - Modifiez les caractéristiques des joueurs
3. `game.js` - Ajoutez des mécaniques de jeu

## À venir / Idées d'amélioration

- Mode multijoueur en ligne
- Ajout de power-ups
- Plusieurs types d'attaques
- Sélection de personnages
- Ajout de sons et de musique
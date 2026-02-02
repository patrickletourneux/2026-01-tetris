# Architecture Hexagonale - Tetris

Ce projet suit les principes de l'architecture hexagonale (Ports & Adapters).

## Structure

```
src/
├── domain/           # CORE - Logique métier pure (aucune dépendance externe)
│   ├── models/       # Entités : Piece, Grid, Game
│   ├── services/     # Services métier et règles du jeu
│   └── types/        # Types TypeScript du domaine
│
├── ports/            # PORTS - Interfaces (contrats entre core et adapters)
│   ├── IGameEngine.ts      # Interface pour le moteur de jeu
│   ├── IRenderer.ts        # Interface pour le rendu
│   └── IInputController.ts # Interface pour les entrées
│
├── adapters/         # ADAPTERS - Implémentations concrètes
│   ├── ui/           # Composants React
│   ├── canvas/       # Renderer Canvas HTML5
│   └── input/        # Gestionnaires d'événements clavier
│
├── App.tsx           # Point d'entrée de l'application React
└── main.tsx          # Bootstrap
```

## Principes

1. **Le domaine ne dépend de rien** : Pas de React, pas de Canvas, pas de DOM
2. **Les ports définissent les contrats** : Interfaces entre le core et le monde extérieur
3. **Les adapters implémentent les ports** : Ils connectent le domaine aux technologies concrètes
4. **Testabilité** : Le domaine est 100% testable sans dépendances

## Flux de données

```
User Input → Input Adapter → Game Service (Domain) → Renderer Port → Canvas Adapter → Screen
```

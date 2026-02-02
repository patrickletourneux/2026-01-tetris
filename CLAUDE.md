
# Projet : Application avec Architecture Hexagonale
**Organisation** : Patrick Letourneux

---

## Langage
Tous les fichiers de script sont en anglais, les commentaires aussi.

## Test
Test unitaire pour tester le domain.
Lancer les tests avant de build le projet pour etre sur que tout fonctionne.

---

# Frontend

**Tech Stack** : React, TypeScript
**Dossier** : `tetris-hexagonal/frontend/`

## Contexte du Projet
Cette application utilise une **architecture hexagonale** pour isoler la logique métier des détails techniques. Le store Redux fait partie du **domaine** (`/domain/store`) car il modélise l'état métier de l'application. La logique métier pure (fonctions de calcul, validation, transformation) est dans `/domain/logic/`. Les composants React n'accèdent jamais directement au store Redux : l'accès se fait via des **ports** et des **adaptateurs**. Les **hooks React** ne doivent jamais apparaître dans le domaine.

## Architecture Hexagonale : Principes Clés
- **Domaine** : Contient la logique métier (`/logic`), les **ports** (interfaces) et le **store Redux** (état métier). Aucun hook React dans le domaine.
- **Adaptateurs** : Implémentent les ports pour accéder aux détails techniques (API, stockage, input). Les hooks React d'accès au store se trouvent ici.
- **Inversion de dépendances** : Le domaine définit des ports (interfaces). Les adaptateurs les implémentent.
- **Composants React** : N'accèdent qu'aux adaptateurs (via des hooks), jamais directement au store Redux.
            L'objectif est que les composants fassent uniquement du rendu, sans logique. Et qu'ils aient le minimum possible de state et de props. que la logique soit dans le Domain.
            Utiliser du react simple avec des hook simple, eviter les useRef.

## Structure des Dossiers

```
/frontend/src
  /domain            # Logique métier, ports, store
    /logic            # Fonctions pures de logique métier
    /ports            # Interfaces pour interagir avec l'état global
    /store            # Slices Redux (état métier, pas de hooks)
    /types            # Types, interfaces, constantes du domaine
  /adapters           # Implémentations des ports
    /controllers      # Orchestrateurs (game loop, etc.)
    /input            # Adaptateurs d'entrée (clavier, etc.)
    /redux            # Adaptateur Redux (hooks React ici)
  /ui                 # Composants React, pages
```

## Exemples de Code

### 1. Définition d'un Port pour l'État Global (Domaine)
```typescript
// /domain/ports/UserStatePort.ts
export interface UserStatePort {
  user: User | null;
  setUser(user: User): void;
  clearUser(): void;
}
```

### 2. Logique métier pure (Domaine — fonctions pures)
```typescript
// /domain/logic/gameLogic.ts
import { GRID_WIDTH, GRID_HEIGHT } from '../types';

export function isValidPosition(grid: number[][], shape: number[][], x: number, y: number): boolean {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = x + col;
        const newY = y + row;
        if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) return false;
        if (newY >= 0 && grid[newY][newX]) return false;
      }
    }
  }
  return true;
}
```

### 3. Store Redux (Domaine — reducers utilisant la logique pure)
```typescript
// /domain/store/gameSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { isValidPosition, lockPiece } from '../logic/gameLogic';

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    moveDown: (state) => {
      if (state.status !== GameStatus.PLAYING || !state.currentPiece) return;
      const newY = state.currentPosition.y + 1;
      if (isValidPosition(state.grid, state.currentPiece.shape, state.currentPosition.x, newY)) {
        state.currentPosition.y = newY;
      } else {
        lockPiece(state);
      }
    },
  },
});
```

### 4. Implémentation de l'Adaptateur Redux (Adaptateur — hooks ici)
```typescript
// /adapters/redux/useGameState.ts
import { useAppDispatch, useAppSelector } from './hooks';
import type { GameStatePort } from '../../domain/ports/GameStatePort';

export const useGameState = (): GameStatePort => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.game);

  return {
    status: gameState.status,
    score: gameState.score,
    startGame: () => dispatch(startGameAction()),
  };
};
```

### 5. Utilisation dans un Composant React (UI)
```typescript
// /ui/GameInfo.tsx
import { useGameState } from '../adapters/redux/useGameState';

export function GameInfo() {
  const { status, score, startGame } = useGameState();

  return (
    <div>
      <div>Score: {score}</div>
      <button onClick={startGame}>Start</button>
    </div>
  );
}
```

## Conventions Frontend

- **TypeScript** : Obligatoire pour tous les fichiers. Typer les slices, les ports et les adaptateurs.
- **Tests** : Tester la logique métier (`/domain/logic/`) et les adaptateurs en isolation.
- **Documentation** : Chaque port et adaptateur doit être documenté avec JSDoc.
- **Redux** : Le store est dans `/domain/store` (état métier), les reducers importent la logique depuis `/domain/logic/`. L'UI n'accède au store que via les adaptateurs.
- **Hooks React** : Interdits dans `/domain`. Ils n'apparaissent que dans `/adapters` et `/ui`.
- **Logique métier** : Les fonctions pures de logique (validation, calcul, transformation) sont dans `/domain/logic/`, séparées des reducers Redux.

---

# Backend

**Tech Stack** : Node.js, Express, PostgreSQL (sans ORM, utilisation directe de `pg`)
**Dossier** : `tetris-hexagonal/backend/`

## Architecture

Le backend suit aussi une architecture hexagonale avec les mêmes principes d'inversion de dépendances.

## Structure des Dossiers

```
/backend/src
  /domain            # Logique métier, ports
    /logic            # Fonctions pures de logique métier
    /ports            # Interfaces (repositories, services)
    /types            # Types, interfaces, constantes du domaine
  /adapters           # Implémentations des ports
    /db               # Accès PostgreSQL via pg (queries SQL directes)
    /api              # Routes Express, middlewares
  /config             # Configuration (database, env)
```

## Conventions Backend

- **TypeScript** : Obligatoire pour tous les fichiers.
- **Pas d'ORM** : Utilisation directe du module `pg` (node-postgres) avec des requêtes SQL.
- **Tests** : Tester la logique métier et les adaptateurs en isolation.
- **Documentation** : Chaque port et adaptateur doit être documenté avec JSDoc.

---

# Conventions API REST (échanges Front / Back)

- **Format** : JSON uniquement (`Content-Type: application/json`).
- **Préfixe** : Toutes les routes backend sont préfixées par `/api` (ex : `/api/auth/login`, `/api/scores`).
- **Méthodes HTTP** :
  - `GET` pour la lecture
  - `POST` pour la création
  - `PUT` pour la mise à jour complète
  - `PATCH` pour la mise à jour partielle
  - `DELETE` pour la suppression
- **Codes HTTP** :
  - `200` : succès
  - `201` : création réussie
  - `400` : erreur de validation / requête invalide
  - `401` : non authentifié
  - `403` : accès interdit
  - `404` : ressource introuvable
  - `500` : erreur serveur
- **Format des réponses** :
  - Succès : `{ "data": ... }`
  - Erreur : `{ "error": "message d'erreur" }`
- **Authentification** : JWT via header `Authorization: Bearer <token>`.
- **Côté frontend** : Les appels API passent par des adaptateurs (dans `/adapters/api/`) qui implémentent des ports du domaine. Les composants React n'appellent jamais `fetch` directement.
- **Côté backend** : Les routes Express (dans `/adapters/api/`) appellent la logique métier via les ports du domaine. Aucune logique métier dans les routes.

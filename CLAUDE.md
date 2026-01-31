
# Projet : Application Frontend avec Architecture Hexagonale
**Organisation** : Patrick Letourneux
**Tech Stack** : React, TypeScript, 
---

## langage
tous les fichiers de script sont anglais, les commentaires aussi.

## Contexte du Projet
Cette application utilise une **architecture hexagonale** pour isoler la logique métier des détails techniques. Le store Redux fait partie du **domaine** (`/domain/store`) car il modélise l'état métier de l'application. La logique métier pure (fonctions de calcul, validation, transformation) est dans `/domain/logic/`. Les composants React n'accèdent jamais directement au store Redux : l'accès se fait via des **ports** et des **adaptateurs**. Les **hooks React** ne doivent jamais apparaître dans le domaine.

---

## Architecture Hexagonale : Principes Clés
- **Domaine** : Contient la logique métier (`/logic`), les **ports** (interfaces) et le **store Redux** (état métier). Aucun hook React dans le domaine.
- **Adaptateurs** : Implémentent les ports pour accéder aux détails techniques (API, stockage, input). Les hooks React d'accès au store se trouvent ici.
- **Inversion de dépendances** : Le domaine définit des ports (interfaces). Les adaptateurs les implémentent.
- **Composants React** : N'accèdent qu'aux adaptateurs (via des hooks), jamais directement au store Redux.
            L'objectif est que les composants fassent uniquement du rendu, sans logique. Et qu'ils aient le minimum possible de state et de props. que la logique soit dans le Domain.
            Utiliser du react simple avec des hook simple, eviter les useRef.

---

## Structure des Dossiers

```
/src
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

---

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

---

## Conventions et Bonnes Pratiques

- **TypeScript** : Obligatoire pour tous les fichiers. Typer les slices, les ports et les adaptateurs.
- **Tests** : Tester la logique métier (`/domain/logic/`) et les adaptateurs en isolation.
- **Documentation** : Chaque port et adaptateur doit être documenté avec JSDoc.
- **Redux** : Le store est dans `/domain/store` (état métier), les reducers importent la logique depuis `/domain/logic/`. L'UI n'accède au store que via les adaptateurs.
- **Hooks React** : Interdits dans `/domain`. Ils n'apparaissent que dans `/adapters` et `/ui`.
- **Logique métier** : Les fonctions pures de logique (validation, calcul, transformation) sont dans `/domain/logic/`, séparées des reducers Redux.

import type { IGameActions } from '../domain/ports/IGameActions';
import type { GameState } from '../domain/types';
import { store } from '../domain/store/store';
import {
  moveLeft,
  moveRight,
  moveDown,
  rotate,
  drop,
  tick,
  pauseGame,
  resumeGame
} from '../domain/store/gameSlice';

/**
 * Adaptateur Redux implémentant IGameActions.
 * Encapsule le dispatch et la lecture du store.
 */
export class ReduxGameActions implements IGameActions {
  moveLeft(): void { store.dispatch(moveLeft()); }
  moveRight(): void { store.dispatch(moveRight()); }
  moveDown(): void { store.dispatch(moveDown()); }
  rotate(): void { store.dispatch(rotate()); }
  drop(): void { store.dispatch(drop()); }
  tick(): void { store.dispatch(tick()); }
  pauseGame(): void { store.dispatch(pauseGame()); }
  resumeGame(): void { store.dispatch(resumeGame()); }

  getGameState(): GameState {
    return store.getState().game;
  }
}

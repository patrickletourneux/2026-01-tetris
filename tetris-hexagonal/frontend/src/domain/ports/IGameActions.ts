import type { GameState } from '../types';

/**
 * Port définissant les actions que le contrôleur peut effectuer sur le jeu.
 * Implémenté par un adaptateur Redux dans /adapters/redux/.
 */
export interface IGameActions {
  moveLeft(): void;
  moveRight(): void;
  moveDown(): void;
  rotate(): void;
  drop(): void;
  tick(): void;
  pauseGame(): void;
  resumeGame(): void;
  getGameState(): GameState;
}

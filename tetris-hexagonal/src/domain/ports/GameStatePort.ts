import type { GameStatus, PieceShape } from '../types';

/**
 * Port définissant l'accès à l'état du jeu pour la couche UI.
 * Implémenté par un adaptateur Redux dans /adapters/redux/.
 */
export interface GameStatePort {
  status: GameStatus;
  score: number;
  level: number;
  linesCleared: number;
  nextPiece: PieceShape | null;
  startGame(): void;
  pauseGame(): void;
  resumeGame(): void;
}

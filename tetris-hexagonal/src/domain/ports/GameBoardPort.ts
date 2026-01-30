import type { GameState } from '../types';

/**
 * Port fournissant l'état du jeu nécessaire au rendu du plateau.
 * Implémenté par un adaptateur Redux dans /adapters/redux/.
 */
export interface GameBoardPort {
  gameState: GameState;
}

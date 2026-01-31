import type { GameState } from '../types';

/**
 * Port fournissant l'état du jeu nécessaire au rendu du plateau.
 * Implémenté par un adaptateur dans /adapters/hooks/.
 */
export interface IGameBoard {
  gameState: GameState;
}

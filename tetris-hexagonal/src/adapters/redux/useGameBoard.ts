import { useAppSelector } from './hooks';
import type { GameBoardPort } from '../../domain/ports/GameBoardPort';

/**
 * Adaptateur Redux implémentant GameBoardPort.
 * Fournit l'état du jeu complet pour le rendu du plateau.
 */
export const useGameBoard = (): GameBoardPort => {
  const gameState = useAppSelector((state) => state.game);
  return { gameState };
};

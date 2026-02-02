import { useAppSelector } from './hooks';
import type { IGameBoard } from '../../domain/ports/IGameBoard';

/**
 * Adaptateur Redux implémentant IGameBoard.
 * Fournit l'état du jeu complet pour le rendu du plateau.
 */
export const useGameBoard = (): IGameBoard => {
  const gameState = useAppSelector((state) => state.game);
  return { gameState };
};

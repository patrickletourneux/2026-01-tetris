import { useAppDispatch, useAppSelector } from './hooks';
import type { IGameState } from '../../domain/ports/IGameState';
import {
  startGame as startGameAction,
  pauseGame as pauseGameAction,
  resumeGame as resumeGameAction
} from '../../domain/store/gameSlice';

/**
 * Adaptateur Redux implémentant IGameState.
 * Seul point d'accès au store Redux pour les composants UI.
 */
export const useGameState = (): IGameState => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.game);

  return {
    status: gameState.status,
    score: gameState.score,
    level: gameState.level,
    linesCleared: gameState.linesCleared,
    nextPiece: gameState.nextPiece,
    startGame: () => dispatch(startGameAction()),
    pauseGame: () => dispatch(pauseGameAction()),
    resumeGame: () => dispatch(resumeGameAction()),
  };
};

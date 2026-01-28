import { createSlice } from '@reduxjs/toolkit';
import { GameStatus, GRID_WIDTH, GRID_HEIGHT } from '../types';
import type { GameState } from '../types';
import { Game } from '../models/Game';

// Singleton game instance managed by Redux
let gameInstance: Game | null = null;

const initialState: GameState = {
  status: GameStatus.IDLE,
  score: 0,
  level: 1,
  linesCleared: 0,
  grid: Array(GRID_HEIGHT).fill(0).map(() => Array(GRID_WIDTH).fill(0)),
  currentPiece: null,
  currentPosition: { x: 0, y: 0 },
  nextPiece: null
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: () => {
      gameInstance = new Game();
      gameInstance.start();
      return gameInstance.getState();
    },

    pauseGame: (state) => {
      if (gameInstance) {
        gameInstance.pause();
        return gameInstance.getState();
      }
      return state;
    },

    resumeGame: (state) => {
      if (gameInstance) {
        gameInstance.resume();
        return gameInstance.getState();
      }
      return state;
    },

    moveLeft: (state) => {
      if (gameInstance && state.status === GameStatus.PLAYING) {
        gameInstance.moveLeft();
        return gameInstance.getState();
      }
      return state;
    },

    moveRight: (state) => {
      if (gameInstance && state.status === GameStatus.PLAYING) {
        gameInstance.moveRight();
        return gameInstance.getState();
      }
      return state;
    },

    moveDown: (state) => {
      if (gameInstance && state.status === GameStatus.PLAYING) {
        gameInstance.moveDown();
        return gameInstance.getState();
      }
      return state;
    },

    rotate: (state) => {
      if (gameInstance && state.status === GameStatus.PLAYING) {
        gameInstance.rotate();
        return gameInstance.getState();
      }
      return state;
    },

    drop: (state) => {
      if (gameInstance && state.status === GameStatus.PLAYING) {
        gameInstance.drop();
        return gameInstance.getState();
      }
      return state;
    },

    tick: (state) => {
      if (gameInstance && state.status === GameStatus.PLAYING) {
        gameInstance.moveDown();
        return gameInstance.getState();
      }
      return state;
    },

    resetGame: () => {
      gameInstance = null;
      return initialState;
    }
  }
});

export const {
  startGame,
  pauseGame,
  resumeGame,
  moveLeft,
  moveRight,
  moveDown,
  rotate,
  drop,
  tick,
  resetGame
} = gameSlice.actions;

// Selector to get drop interval
export const selectDropInterval = (_state: { game: GameState }): number => {
  if (gameInstance) {
    return gameInstance.getDropInterval();
  }
  return 1000;
};

export default gameSlice.reducer;

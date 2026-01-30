import { createSlice } from '@reduxjs/toolkit';
import { GameStatus } from '../types';
import type { GameState } from '../types';
import {
  createEmptyGrid,
  isValidPosition,
  rotateShape,
  randomPieceShape
} from '../logic/gameLogic';
import {
  spawnPiece,
  lockPiece,
  updateGhostPosition
} from '../logic/stateMutators';

const initialState: GameState = {
  status: GameStatus.IDLE,
  score: 0,
  level: 1,
  linesCleared: 0,
  grid: createEmptyGrid(),
  currentPiece: null,
  currentPosition: { x: 0, y: 0 },
  ghostPosition: { x: 0, y: 0 },
  nextPiece: null
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state) => {
      state.status = GameStatus.PLAYING;
      state.score = 0;
      state.level = 1;
      state.linesCleared = 0;
      state.grid = createEmptyGrid();
      state.nextPiece = randomPieceShape();
      spawnPiece(state);
    },

    pauseGame: (state) => {
      if (state.status === GameStatus.PLAYING) {
        state.status = GameStatus.PAUSED;
      }
    },

    resumeGame: (state) => {
      if (state.status === GameStatus.PAUSED) {
        state.status = GameStatus.PLAYING;
      }
    },

    moveLeft: (state) => {
      if (state.status !== GameStatus.PLAYING || !state.currentPiece) return;
      const newX = state.currentPosition.x - 1;
      if (isValidPosition(state.grid, state.currentPiece.shape, newX, state.currentPosition.y)) {
        state.currentPosition.x = newX;
        updateGhostPosition(state);
      }
    },

    moveRight: (state) => {
      if (state.status !== GameStatus.PLAYING || !state.currentPiece) return;
      const newX = state.currentPosition.x + 1;
      if (isValidPosition(state.grid, state.currentPiece.shape, newX, state.currentPosition.y)) {
        state.currentPosition.x = newX;
        updateGhostPosition(state);
      }
    },

    moveDown: (state) => {
      if (state.status !== GameStatus.PLAYING || !state.currentPiece) return;
      const newY = state.currentPosition.y + 1;
      if (isValidPosition(state.grid, state.currentPiece.shape, state.currentPosition.x, newY)) {
        state.currentPosition.y = newY;
        updateGhostPosition(state);
      } else {
        lockPiece(state);
      }
    },

    rotate: (state) => {
      if (state.status !== GameStatus.PLAYING || !state.currentPiece) return;
      const rotated = rotateShape(state.currentPiece.shape);
      if (isValidPosition(state.grid, rotated, state.currentPosition.x, state.currentPosition.y)) {
        state.currentPiece.shape = rotated;
        updateGhostPosition(state);
      }
    },

    drop: (state) => {
      if (state.status !== GameStatus.PLAYING || !state.currentPiece) return;
      while (isValidPosition(state.grid, state.currentPiece.shape, state.currentPosition.x, state.currentPosition.y + 1)) {
        state.currentPosition.y += 1;
        state.score += 2;
      }
      lockPiece(state);
    },

    tick: (state) => {
      if (state.status !== GameStatus.PLAYING || !state.currentPiece) return;
      const newY = state.currentPosition.y + 1;
      if (isValidPosition(state.grid, state.currentPiece.shape, state.currentPosition.x, newY)) {
        state.currentPosition.y = newY;
        updateGhostPosition(state);
      } else {
        lockPiece(state);
      }
    },

    resetGame: () => initialState
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

export default gameSlice.reducer;

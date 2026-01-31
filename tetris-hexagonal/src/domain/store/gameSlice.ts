import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { GameStatus, GRID_WIDTH, GRID_HEIGHT } from '../types';
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
} from './stateMutators';

const initialState: GameState = {
  status: GameStatus.IDLE,
  score: 0,
  level: 1,
  linesCleared: 0,
  grid: createEmptyGrid(),
  currentPiece: null,
  currentPosition: { x: 0, y: 0 },
  ghostPosition: { x: 0, y: 0 },
  nextPiece: null,
  gridWidth: GRID_WIDTH,
  gridHeight: GRID_HEIGHT
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
      state.grid = createEmptyGrid(state.gridWidth, state.gridHeight);
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

    setGridWidth: (state, action: PayloadAction<number>) => {
      state.gridWidth = Math.max(4, Math.min(30, action.payload));
      state.grid = createEmptyGrid(state.gridWidth, state.gridHeight);
      state.status = GameStatus.IDLE;
      state.score = 0;
      state.level = 1;
      state.linesCleared = 0;
      state.currentPiece = null;
      state.nextPiece = null;
    },

    setGridHeight: (state, action: PayloadAction<number>) => {
      state.gridHeight = Math.max(4, Math.min(40, action.payload));
      state.grid = createEmptyGrid(state.gridWidth, state.gridHeight);
      state.status = GameStatus.IDLE;
      state.score = 0;
      state.level = 1;
      state.linesCleared = 0;
      state.currentPiece = null;
      state.nextPiece = null;
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
  setGridWidth,
  setGridHeight,
  resetGame
} = gameSlice.actions;

export default gameSlice.reducer;

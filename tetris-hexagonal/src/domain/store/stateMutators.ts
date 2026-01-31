import { GameStatus } from '../types';
import type { GameState } from '../types';
import {
  isValidPosition,
  randomPieceShape,
  calculateScore,
  computeGhostPosition
} from '../logic/gameLogic';

export function placePieceOnGrid(grid: number[][], shape: number[][], x: number, y: number): void {
  const gridHeight = grid.length;
  const gridWidth = grid[0]?.length ?? 0;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = x + col;
        const newY = y + row;
        if (newY >= 0 && newY < gridHeight && newX >= 0 && newX < gridWidth) {
          grid[newY][newX] = 1;
        }
      }
    }
  }
}

export function clearLines(grid: number[][]): number {
  const gridHeight = grid.length;
  const gridWidth = grid[0]?.length ?? 0;
  let linesCleared = 0;

  for (let row = gridHeight - 1; row >= 0; row--) {
    if (grid[row].every(cell => cell !== 0)) {
      grid.splice(row, 1);
      grid.unshift(Array(gridWidth).fill(0));
      linesCleared++;
      row++;
    }
  }
  return linesCleared;
}

export function updateGhostPosition(state: GameState): void {
  if (state.currentPiece) {
    state.ghostPosition = {
      x: state.currentPosition.x,
      y: computeGhostPosition(state.grid, state.currentPiece.shape, state.currentPosition.x, state.currentPosition.y)
    };
  }
}

export function spawnPiece(state: GameState): void {
  state.currentPiece = state.nextPiece;
  state.nextPiece = randomPieceShape();
  state.currentPosition = {
    x: Math.floor(state.gridWidth / 2) - Math.floor(state.currentPiece!.shape[0].length / 2),
    y: 0
  };

  if (!isValidPosition(state.grid, state.currentPiece!.shape, state.currentPosition.x, state.currentPosition.y)) {
    state.status = GameStatus.GAME_OVER;
  }

  updateGhostPosition(state);
}

export function lockPiece(state: GameState): void {
  if (!state.currentPiece) return;

  placePieceOnGrid(state.grid, state.currentPiece.shape, state.currentPosition.x, state.currentPosition.y);

  const lines = clearLines(state.grid);
  if (lines > 0) {
    state.linesCleared += lines;
    state.score += calculateScore(lines, state.level);
    state.level = Math.floor(state.linesCleared / 10) + 1;
  }

  spawnPiece(state);
}

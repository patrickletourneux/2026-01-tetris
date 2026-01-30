import { GameStatus, PieceType, PIECE_SHAPES, GRID_WIDTH, GRID_HEIGHT } from '../types';
import type { GameState, PieceShape } from '../types';

export function createEmptyGrid(): number[][] {
  return Array(GRID_HEIGHT).fill(0).map(() => Array(GRID_WIDTH).fill(0));
}

export function isValidPosition(grid: number[][], shape: number[][], x: number, y: number): boolean {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = x + col;
        const newY = y + row;
        if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) return false;
        if (newY >= 0 && grid[newY][newX]) return false;
      }
    }
  }
  return true;
}

export function placePieceOnGrid(grid: number[][], shape: number[][], x: number, y: number): void {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = x + col;
        const newY = y + row;
        if (newY >= 0 && newY < GRID_HEIGHT && newX >= 0 && newX < GRID_WIDTH) {
          grid[newY][newX] = 1;
        }
      }
    }
  }
}

export function clearLines(grid: number[][]): number {
  let linesCleared = 0;
  for (let row = GRID_HEIGHT - 1; row >= 0; row--) {
    if (grid[row].every(cell => cell !== 0)) {
      grid.splice(row, 1);
      grid.unshift(Array(GRID_WIDTH).fill(0));
      linesCleared++;
      row++;
    }
  }
  return linesCleared;
}

export function rotateShape(shape: number[][]): number[][] {
  const n = shape.length;
  const rotated: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      rotated[j][n - 1 - i] = shape[i][j];
    }
  }
  return rotated;
}

export function randomPieceShape(): PieceShape {
  const types = Object.values(PieceType);
  const randomType = types[Math.floor(Math.random() * types.length)];
  const pieceData = PIECE_SHAPES[randomType];
  return {
    type: randomType,
    shape: pieceData.shape.map(row => [...row]),
    color: pieceData.color
  };
}

export function calculateScore(lines: number, level: number): number {
  const baseScores = [0, 100, 300, 500, 800];
  return baseScores[lines] * level;
}

export function computeGhostPosition(grid: number[][], shape: number[][], x: number, y: number): number {
  let ghostY = y;
  while (isValidPosition(grid, shape, x, ghostY + 1)) {
    ghostY++;
  }
  return ghostY;
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
    x: Math.floor(GRID_WIDTH / 2) - Math.floor(state.currentPiece!.shape[0].length / 2),
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

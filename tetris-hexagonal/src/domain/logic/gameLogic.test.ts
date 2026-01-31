import {
  createEmptyGrid,
  isValidPosition,
  rotateShape,
  randomPieceShape,
  calculateScore,
  computeGhostPosition
} from './gameLogic';
import { GRID_WIDTH, GRID_HEIGHT, PieceType, PIECE_SHAPES } from '../types';

describe('createEmptyGrid', () => {
  it('should create a 20x10 grid filled with zeros', () => {
    const grid = createEmptyGrid();
    expect(grid).toHaveLength(GRID_HEIGHT);
    expect(grid[0]).toHaveLength(GRID_WIDTH);
    expect(grid.every(row => row.every(cell => cell === 0))).toBe(true);
  });

  it('should return independent rows (no shared references)', () => {
    const grid = createEmptyGrid();
    grid[0][0] = 1;
    expect(grid[1][0]).toBe(0);
  });
});

describe('isValidPosition', () => {
  let grid: number[][];

  beforeEach(() => {
    grid = createEmptyGrid();
  });

  it('should accept a valid position on an empty grid', () => {
    const shape = [[1, 1], [1, 1]];
    expect(isValidPosition(grid, shape, 0, 0)).toBe(true);
  });

  it('should reject a position out of bounds on the left', () => {
    const shape = [[1]];
    expect(isValidPosition(grid, shape, -1, 0)).toBe(false);
  });

  it('should reject a position out of bounds on the right', () => {
    const shape = [[1]];
    expect(isValidPosition(grid, shape, GRID_WIDTH, 0)).toBe(false);
  });

  it('should reject a position out of bounds at the bottom', () => {
    const shape = [[1]];
    expect(isValidPosition(grid, shape, 0, GRID_HEIGHT)).toBe(false);
  });

  it('should accept a negative y (piece partially above the grid)', () => {
    const shape = [
      [1],
      [1]
    ];
    expect(isValidPosition(grid, shape, 0, -1)).toBe(true);
  });

  it('should reject a collision with an occupied cell', () => {
    grid[5][3] = 1;
    const shape = [[1]];
    expect(isValidPosition(grid, shape, 3, 5)).toBe(false);
  });

  it('should accept when empty shape cells overlap occupied grid cells', () => {
    grid[0][0] = 1;
    const shape = [
      [0, 1],
      [1, 0]
    ];
    expect(isValidPosition(grid, shape, 0, 0)).toBe(true);
  });

  it('should reject LINE piece flush against the right wall', () => {
    const lineShape = PIECE_SHAPES[PieceType.LINE].shape;
    expect(isValidPosition(grid, lineShape, GRID_WIDTH - 3, 0)).toBe(false);
  });
});

describe('rotateShape', () => {
  it('should perform a 90° clockwise rotation on a T piece', () => {
    const tShape = [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ];
    const rotated = rotateShape(tShape);
    expect(rotated).toEqual([
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0]
    ]);
  });

  it('should return to the original shape after 4 rotations', () => {
    const shape = [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ];
    let rotated = shape;
    for (let i = 0; i < 4; i++) {
      rotated = rotateShape(rotated);
    }
    expect(rotated).toEqual(shape);
  });

  it('should not change a square piece', () => {
    const square = [
      [1, 1],
      [1, 1]
    ];
    expect(rotateShape(square)).toEqual(square);
  });
});

describe('calculateScore', () => {
  it('should return 0 for 0 lines', () => {
    expect(calculateScore(0, 1)).toBe(0);
  });

  it('should return 100 for 1 line at level 1', () => {
    expect(calculateScore(1, 1)).toBe(100);
  });

  it('should return 300 for 2 lines at level 1', () => {
    expect(calculateScore(2, 1)).toBe(300);
  });

  it('should return 500 for 3 lines at level 1', () => {
    expect(calculateScore(3, 1)).toBe(500);
  });

  it('should return 800 for a tetris (4 lines) at level 1', () => {
    expect(calculateScore(4, 1)).toBe(800);
  });

  it('should multiply score by level', () => {
    expect(calculateScore(1, 5)).toBe(500);
    expect(calculateScore(4, 3)).toBe(2400);
  });
});

describe('computeGhostPosition', () => {
  let grid: number[][];

  beforeEach(() => {
    grid = createEmptyGrid();
  });

  it('should fall to the bottom on an empty grid', () => {
    const shape = [[1]];
    const ghostY = computeGhostPosition(grid, shape, 0, 0);
    expect(ghostY).toBe(GRID_HEIGHT - 1);
  });

  it('should stop above an occupied cell', () => {
    grid[10][0] = 1;
    const shape = [[1]];
    const ghostY = computeGhostPosition(grid, shape, 0, 0);
    expect(ghostY).toBe(9);
  });

  it('should stay in place if already blocked', () => {
    grid[1][0] = 1;
    const shape = [[1]];
    const ghostY = computeGhostPosition(grid, shape, 0, 0);
    expect(ghostY).toBe(0);
  });

  it('should handle a multi-row piece', () => {
    const shape = [
      [1],
      [1]
    ];
    const ghostY = computeGhostPosition(grid, shape, 0, 0);
    expect(ghostY).toBe(GRID_HEIGHT - 2);
  });
});

describe('randomPieceShape', () => {
  it('should return a valid PieceShape', () => {
    const piece = randomPieceShape();
    expect(piece).toHaveProperty('type');
    expect(piece).toHaveProperty('shape');
    expect(piece).toHaveProperty('color');
    expect(Object.values(PieceType)).toContain(piece.type);
  });

  it('should return a copy of the shape (not the original reference)', () => {
    const piece = randomPieceShape();
    const original = PIECE_SHAPES[piece.type].shape;
    expect(piece.shape).not.toBe(original);
    expect(piece.shape).toEqual(original);
  });
});

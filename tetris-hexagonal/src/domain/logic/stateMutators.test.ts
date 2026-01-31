import { placePieceOnGrid, clearLines, updateGhostPosition, lockPiece } from './stateMutators';
import { createEmptyGrid } from './gameLogic';
import { GRID_WIDTH, GRID_HEIGHT, GameStatus, PieceType } from '../types';
import type { GameState, PieceShape } from '../types';

function createPlayingState(overrides: Partial<GameState> = {}): GameState {
  return {
    status: GameStatus.PLAYING,
    score: 0,
    level: 1,
    linesCleared: 0,
    grid: createEmptyGrid(),
    currentPiece: {
      type: PieceType.SQUARE,
      shape: [[1, 1], [1, 1]],
      color: '#f0f000'
    },
    currentPosition: { x: 4, y: 0 },
    ghostPosition: { x: 4, y: 0 },
    nextPiece: {
      type: PieceType.T_SHAPE,
      shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
      color: '#a000f0'
    },
    ...overrides
  };
}

describe('placePieceOnGrid', () => {
  it('should place a piece at the correct position', () => {
    const grid = createEmptyGrid();
    const shape = [[1, 1], [1, 1]];
    placePieceOnGrid(grid, shape, 3, 5);

    expect(grid[5][3]).toBe(1);
    expect(grid[5][4]).toBe(1);
    expect(grid[6][3]).toBe(1);
    expect(grid[6][4]).toBe(1);
  });

  it('should only place filled cells (respects shape zeros)', () => {
    const grid = createEmptyGrid();
    const shape = [
      [0, 1],
      [1, 0]
    ];
    placePieceOnGrid(grid, shape, 0, 0);

    expect(grid[0][0]).toBe(0);
    expect(grid[0][1]).toBe(1);
    expect(grid[1][0]).toBe(1);
    expect(grid[1][1]).toBe(0);
  });

  it('should ignore cells outside grid bounds', () => {
    const grid = createEmptyGrid();
    const shape = [[1]];
    placePieceOnGrid(grid, shape, 0, -1);

    expect(grid[0][0]).toBe(0);
  });
});

describe('clearLines', () => {
  it('should return 0 when no lines are full', () => {
    const grid = createEmptyGrid();
    expect(clearLines(grid)).toBe(0);
  });

  it('should clear a single full line and shift rows down', () => {
    const grid = createEmptyGrid();
    grid[GRID_HEIGHT - 1] = Array(GRID_WIDTH).fill(1);
    grid[GRID_HEIGHT - 2][0] = 1;

    const cleared = clearLines(grid);

    expect(cleared).toBe(1);
    expect(grid[GRID_HEIGHT - 1][0]).toBe(1);
    expect(grid[GRID_HEIGHT - 1][1]).toBe(0);
    expect(grid[0].every(cell => cell === 0)).toBe(true);
  });

  it('should clear 4 lines (tetris)', () => {
    const grid = createEmptyGrid();
    for (let i = GRID_HEIGHT - 4; i < GRID_HEIGHT; i++) {
      grid[i] = Array(GRID_WIDTH).fill(1);
    }

    const cleared = clearLines(grid);

    expect(cleared).toBe(4);
    expect(grid.every(row => row.every(cell => cell === 0))).toBe(true);
  });

  it('should clear non-adjacent full lines', () => {
    const grid = createEmptyGrid();
    grid[GRID_HEIGHT - 1] = Array(GRID_WIDTH).fill(1);
    grid[GRID_HEIGHT - 3] = Array(GRID_WIDTH).fill(1);

    const cleared = clearLines(grid);

    expect(cleared).toBe(2);
  });

  it('should preserve the total row count after clearing', () => {
    const grid = createEmptyGrid();
    grid[GRID_HEIGHT - 1] = Array(GRID_WIDTH).fill(1);
    clearLines(grid);
    expect(grid).toHaveLength(GRID_HEIGHT);
  });
});

describe('updateGhostPosition', () => {
  it('should set ghost position at the bottom of an empty grid', () => {
    const state = createPlayingState();
    updateGhostPosition(state);

    expect(state.ghostPosition.x).toBe(state.currentPosition.x);
    expect(state.ghostPosition.y).toBe(GRID_HEIGHT - 2);
  });

  it('should not modify state if currentPiece is null', () => {
    const state = createPlayingState({ currentPiece: null });
    const originalGhost = { ...state.ghostPosition };
    updateGhostPosition(state);

    expect(state.ghostPosition).toEqual(originalGhost);
  });
});

describe('lockPiece', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should place the piece on the grid and spawn a new one', () => {
    const state = createPlayingState({
      currentPosition: { x: 4, y: GRID_HEIGHT - 2 }
    });
    lockPiece(state);

    expect(state.grid[GRID_HEIGHT - 2][4]).toBe(1);
    expect(state.grid[GRID_HEIGHT - 2][5]).toBe(1);
    expect(state.grid[GRID_HEIGHT - 1][4]).toBe(1);
    expect(state.grid[GRID_HEIGHT - 1][5]).toBe(1);
    expect(state.currentPiece).not.toBeNull();
  });

  it('should do nothing if currentPiece is null', () => {
    const state = createPlayingState({ currentPiece: null });
    const gridBefore = state.grid.map(row => [...row]);
    lockPiece(state);

    expect(state.grid).toEqual(gridBefore);
  });

  it('should update score and level when lines are cleared', () => {
    const state = createPlayingState({
      currentPosition: { x: 0, y: GRID_HEIGHT - 2 }
    });
    for (let col = 2; col < GRID_WIDTH; col++) {
      state.grid[GRID_HEIGHT - 1][col] = 1;
      state.grid[GRID_HEIGHT - 2][col] = 1;
    }

    lockPiece(state);

    expect(state.linesCleared).toBe(2);
    expect(state.score).toBe(300);
  });

  it('should trigger game over when new piece cannot spawn', () => {
    const state = createPlayingState({
      currentPiece: {
        type: PieceType.SQUARE,
        shape: [[1, 1], [1, 1]],
        color: '#f0f000'
      },
      currentPosition: { x: 0, y: GRID_HEIGHT - 2 }
    });
    // Fill rows 0 and 1 partially (not full, so they won't be cleared)
    for (let col = 0; col < GRID_WIDTH - 1; col++) {
      state.grid[0][col] = 1;
      state.grid[1][col] = 1;
    }

    lockPiece(state);

    expect(state.status).toBe(GameStatus.GAME_OVER);
  });
});

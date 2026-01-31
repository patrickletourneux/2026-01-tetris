import reducer, {
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
} from './gameSlice';
import { GameStatus, GRID_WIDTH, GRID_HEIGHT, PieceType } from '../types';
import type { GameState } from '../types';
import { createEmptyGrid } from '../logic/gameLogic';

function createPlayingState(overrides: Partial<GameState> = {}): GameState {
  return {
    status: GameStatus.PLAYING,
    score: 0,
    level: 1,
    linesCleared: 0,
    grid: createEmptyGrid(),
    currentPiece: {
      type: PieceType.T_SHAPE,
      shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
      color: '#a000f0'
    },
    currentPosition: { x: 4, y: 0 },
    ghostPosition: { x: 4, y: 18 },
    nextPiece: {
      type: PieceType.SQUARE,
      shape: [[1, 1], [1, 1]],
      color: '#f0f000'
    },
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    ...overrides
  };
}

beforeEach(() => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('startGame', () => {
  it('should initialize a new game with PLAYING status', () => {
    const state = reducer(undefined, startGame());

    expect(state.status).toBe(GameStatus.PLAYING);
    expect(state.score).toBe(0);
    expect(state.level).toBe(1);
    expect(state.linesCleared).toBe(0);
    expect(state.currentPiece).not.toBeNull();
    expect(state.nextPiece).not.toBeNull();
  });

  it('should reset state when called during a game', () => {
    const playing = createPlayingState({ score: 500, level: 3 });
    const state = reducer(playing, startGame());

    expect(state.score).toBe(0);
    expect(state.level).toBe(1);
  });
});

describe('pauseGame', () => {
  it('should transition from PLAYING to PAUSED', () => {
    const playing = createPlayingState();
    const state = reducer(playing, pauseGame());
    expect(state.status).toBe(GameStatus.PAUSED);
  });

  it('should be ignored if not PLAYING', () => {
    const idle: GameState = {
      ...createPlayingState(),
      status: GameStatus.IDLE
    };
    const state = reducer(idle, pauseGame());
    expect(state.status).toBe(GameStatus.IDLE);
  });
});

describe('resumeGame', () => {
  it('should transition from PAUSED to PLAYING', () => {
    const paused = createPlayingState({ status: GameStatus.PAUSED });
    const state = reducer(paused, resumeGame());
    expect(state.status).toBe(GameStatus.PLAYING);
  });

  it('should be ignored if not PAUSED', () => {
    const playing = createPlayingState();
    const state = reducer(playing, resumeGame());
    expect(state.status).toBe(GameStatus.PLAYING);
  });
});

describe('moveLeft', () => {
  it('should move piece one cell to the left', () => {
    const playing = createPlayingState({ currentPosition: { x: 4, y: 5 } });
    const state = reducer(playing, moveLeft());
    expect(state.currentPosition.x).toBe(3);
  });

  it('should not move if blocked by the left wall', () => {
    const playing = createPlayingState({ currentPosition: { x: 0, y: 5 } });
    const state = reducer(playing, moveLeft());
    expect(state.currentPosition.x).toBe(0);
  });

  it('should be ignored if not PLAYING', () => {
    const paused = createPlayingState({
      status: GameStatus.PAUSED,
      currentPosition: { x: 4, y: 5 }
    });
    const state = reducer(paused, moveLeft());
    expect(state.currentPosition.x).toBe(4);
  });
});

describe('moveRight', () => {
  it('should move piece one cell to the right', () => {
    const playing = createPlayingState({ currentPosition: { x: 4, y: 5 } });
    const state = reducer(playing, moveRight());
    expect(state.currentPosition.x).toBe(5);
  });

  it('should not move if blocked by the right wall', () => {
    const playing = createPlayingState({
      currentPosition: { x: GRID_WIDTH - 3, y: 5 }
    });
    const state = reducer(playing, moveRight());
    expect(state.currentPosition.x).toBe(GRID_WIDTH - 3);
  });
});

describe('moveDown', () => {
  it('should move piece one cell down', () => {
    const playing = createPlayingState({ currentPosition: { x: 4, y: 5 } });
    const state = reducer(playing, moveDown());
    expect(state.currentPosition.y).toBe(6);
  });

  it('should lock the piece when it cannot move further down', () => {
    const playing = createPlayingState({
      currentPiece: {
        type: PieceType.SQUARE,
        shape: [[1, 1], [1, 1]],
        color: '#f0f000'
      },
      currentPosition: { x: 0, y: GRID_HEIGHT - 2 }
    });
    const state = reducer(playing, moveDown());

    expect(state.grid[GRID_HEIGHT - 2][0]).toBe(1);
    expect(state.grid[GRID_HEIGHT - 1][0]).toBe(1);
  });
});

describe('rotate', () => {
  it('should rotate the piece when position is valid', () => {
    const playing = createPlayingState({ currentPosition: { x: 4, y: 5 } });
    const shapeBefore = playing.currentPiece!.shape.map(r => [...r]);
    const state = reducer(playing, rotate());

    expect(state.currentPiece!.shape).not.toEqual(shapeBefore);
  });

  it('should not rotate if the rotated shape collides', () => {
    const playing = createPlayingState({
      currentPiece: {
        type: PieceType.LINE,
        shape: [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        color: '#00f0f0'
      },
      currentPosition: { x: GRID_WIDTH - 2, y: 0 }
    });
    const state = reducer(playing, rotate());

    expect(state.currentPiece!.shape).toEqual(playing.currentPiece!.shape);
  });

  it('should be ignored if not PLAYING', () => {
    const paused = createPlayingState({ status: GameStatus.PAUSED });
    const shapeBefore = paused.currentPiece!.shape.map(r => [...r]);
    const state = reducer(paused, rotate());
    expect(state.currentPiece!.shape).toEqual(shapeBefore);
  });
});

describe('drop', () => {
  it('should drop the piece to the bottom and lock it', () => {
    const playing = createPlayingState({
      currentPiece: {
        type: PieceType.SQUARE,
        shape: [[1, 1], [1, 1]],
        color: '#f0f000'
      },
      currentPosition: { x: 0, y: 0 }
    });
    const state = reducer(playing, drop());

    expect(state.grid[GRID_HEIGHT - 2][0]).toBe(1);
    expect(state.grid[GRID_HEIGHT - 1][0]).toBe(1);
  });

  it('should add 2 points per cell dropped', () => {
    const playing = createPlayingState({
      currentPiece: {
        type: PieceType.SQUARE,
        shape: [[1, 1], [1, 1]],
        color: '#f0f000'
      },
      currentPosition: { x: 0, y: 0 }
    });
    const state = reducer(playing, drop());

    const expectedDropDistance = GRID_HEIGHT - 2;
    expect(state.score).toBe(expectedDropDistance * 2);
  });

  it('should be ignored if not PLAYING', () => {
    const paused = createPlayingState({ status: GameStatus.PAUSED });
    const state = reducer(paused, drop());
    expect(state.grid).toEqual(paused.grid);
  });
});

describe('tick', () => {
  it('should move piece down by one', () => {
    const playing = createPlayingState({ currentPosition: { x: 4, y: 5 } });
    const state = reducer(playing, tick());
    expect(state.currentPosition.y).toBe(6);
  });

  it('should lock the piece when it hits the bottom', () => {
    const playing = createPlayingState({
      currentPiece: {
        type: PieceType.SQUARE,
        shape: [[1, 1], [1, 1]],
        color: '#f0f000'
      },
      currentPosition: { x: 0, y: GRID_HEIGHT - 2 }
    });
    const state = reducer(playing, tick());

    expect(state.grid[GRID_HEIGHT - 2][0]).toBe(1);
  });
});

describe('setGridWidth', () => {
  it('should update grid width and reset game state', () => {
    const playing = createPlayingState({ score: 500, level: 3 });
    const state = reducer(playing, setGridWidth(15));

    expect(state.gridWidth).toBe(15);
    expect(state.grid[0].length).toBe(15);
    expect(state.status).toBe(GameStatus.IDLE);
    expect(state.score).toBe(0);
    expect(state.level).toBe(1);
    expect(state.currentPiece).toBeNull();
    expect(state.nextPiece).toBeNull();
  });

  it('should clamp width to minimum of 4', () => {
    const idle = createPlayingState({ status: GameStatus.IDLE });
    const state = reducer(idle, setGridWidth(2));

    expect(state.gridWidth).toBe(4);
  });

  it('should clamp width to maximum of 30', () => {
    const idle = createPlayingState({ status: GameStatus.IDLE });
    const state = reducer(idle, setGridWidth(50));

    expect(state.gridWidth).toBe(30);
  });

  it('should reset even if already IDLE', () => {
    const idle = createPlayingState({
      status: GameStatus.IDLE,
      score: 100,
      gridWidth: 10
    });
    const state = reducer(idle, setGridWidth(12));

    expect(state.gridWidth).toBe(12);
    expect(state.score).toBe(0);
  });
});

describe('setGridHeight', () => {
  it('should update grid height and reset game state', () => {
    const playing = createPlayingState({ score: 500, level: 3 });
    const state = reducer(playing, setGridHeight(25));

    expect(state.gridHeight).toBe(25);
    expect(state.grid.length).toBe(25);
    expect(state.status).toBe(GameStatus.IDLE);
    expect(state.score).toBe(0);
    expect(state.level).toBe(1);
    expect(state.currentPiece).toBeNull();
    expect(state.nextPiece).toBeNull();
  });

  it('should clamp height to minimum of 4', () => {
    const idle = createPlayingState({ status: GameStatus.IDLE });
    const state = reducer(idle, setGridHeight(2));

    expect(state.gridHeight).toBe(4);
  });

  it('should clamp height to maximum of 40', () => {
    const idle = createPlayingState({ status: GameStatus.IDLE });
    const state = reducer(idle, setGridHeight(50));

    expect(state.gridHeight).toBe(40);
  });

  it('should reset even during GAME_OVER', () => {
    const gameOver = createPlayingState({
      status: GameStatus.GAME_OVER,
      score: 1000,
      gridHeight: 20
    });
    const state = reducer(gameOver, setGridHeight(15));

    expect(state.gridHeight).toBe(15);
    expect(state.status).toBe(GameStatus.IDLE);
    expect(state.score).toBe(0);
  });
});

describe('resetGame', () => {
  it('should reset to initial state', () => {
    const playing = createPlayingState({ score: 1000, level: 5 });
    const state = reducer(playing, resetGame());

    expect(state.status).toBe(GameStatus.IDLE);
    expect(state.score).toBe(0);
    expect(state.level).toBe(1);
    expect(state.currentPiece).toBeNull();
    expect(state.nextPiece).toBeNull();
  });
});

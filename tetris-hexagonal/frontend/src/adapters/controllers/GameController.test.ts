import { GameController } from './GameController';
import { InputAction } from '../../domain/ports/IInputController';
import { GameStatus } from '../../domain/types';
import type { IInputController } from '../../domain/ports/IInputController';
import type { IGameActions } from '../../domain/ports/IGameActions';
import type { GameState } from '../../domain/types';

let capturedOnAction: ((action: InputAction) => void) | null = null;

function createMockInputController(): IInputController {
  return {
    initEventListeners: jest.fn((onAction) => {
      capturedOnAction = onAction;
    }),
    cleanup: jest.fn()
  };
}

function createMockGameActions(status: GameStatus = GameStatus.PLAYING): IGameActions {
  return {
    moveLeft: jest.fn(),
    moveRight: jest.fn(),
    moveDown: jest.fn(),
    rotate: jest.fn(),
    drop: jest.fn(),
    tick: jest.fn(),
    pauseGame: jest.fn(),
    resumeGame: jest.fn(),
    getGameState: jest.fn().mockReturnValue({ status } as GameState)
  };
}

beforeEach(() => {
  capturedOnAction = null;
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('GameController initialization', () => {
  it('should call initEventListeners on the input controller', () => {
    const input = createMockInputController();
    const actions = createMockGameActions();

    new GameController(input, actions);

    expect(input.initEventListeners).toHaveBeenCalledTimes(1);
    expect(typeof capturedOnAction).toBe('function');
  });
});

describe('GameController input routing', () => {
  it('should call moveLeft on MOVE_LEFT action', () => {
    const input = createMockInputController();
    const actions = createMockGameActions();
    new GameController(input, actions);

    capturedOnAction!(InputAction.MOVE_LEFT);

    expect(actions.moveLeft).toHaveBeenCalledTimes(1);
  });

  it('should call moveRight on MOVE_RIGHT action', () => {
    const input = createMockInputController();
    const actions = createMockGameActions();
    new GameController(input, actions);

    capturedOnAction!(InputAction.MOVE_RIGHT);

    expect(actions.moveRight).toHaveBeenCalledTimes(1);
  });

  it('should call moveDown on MOVE_DOWN action', () => {
    const input = createMockInputController();
    const actions = createMockGameActions();
    new GameController(input, actions);

    capturedOnAction!(InputAction.MOVE_DOWN);

    expect(actions.moveDown).toHaveBeenCalledTimes(1);
  });

  it('should call rotate on ROTATE action', () => {
    const input = createMockInputController();
    const actions = createMockGameActions();
    new GameController(input, actions);

    capturedOnAction!(InputAction.ROTATE);

    expect(actions.rotate).toHaveBeenCalledTimes(1);
  });

  it('should call drop on DROP action', () => {
    const input = createMockInputController();
    const actions = createMockGameActions();
    new GameController(input, actions);

    capturedOnAction!(InputAction.DROP);

    expect(actions.drop).toHaveBeenCalledTimes(1);
  });

  it('should call pauseGame on PAUSE action when PLAYING', () => {
    const input = createMockInputController();
    const actions = createMockGameActions(GameStatus.PLAYING);
    new GameController(input, actions);

    capturedOnAction!(InputAction.PAUSE);

    expect(actions.pauseGame).toHaveBeenCalledTimes(1);
    expect(actions.resumeGame).not.toHaveBeenCalled();
  });

  it('should call resumeGame on PAUSE action when PAUSED', () => {
    const input = createMockInputController();
    const actions = createMockGameActions(GameStatus.PAUSED);
    new GameController(input, actions);

    capturedOnAction!(InputAction.PAUSE);

    expect(actions.resumeGame).toHaveBeenCalledTimes(1);
    expect(actions.pauseGame).not.toHaveBeenCalled();
  });

  it('should not pause or resume on PAUSE action when IDLE', () => {
    const input = createMockInputController();
    const actions = createMockGameActions(GameStatus.IDLE);
    new GameController(input, actions);

    capturedOnAction!(InputAction.PAUSE);

    expect(actions.pauseGame).not.toHaveBeenCalled();
    expect(actions.resumeGame).not.toHaveBeenCalled();
  });
});

describe('GameController game loop', () => {
  it('should call tick every 500ms when PLAYING', () => {
    const input = createMockInputController();
    const actions = createMockGameActions(GameStatus.PLAYING);
    new GameController(input, actions);

    jest.advanceTimersByTime(500);
    expect(actions.tick).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);
    expect(actions.tick).toHaveBeenCalledTimes(2);
  });

  it('should not call tick when PAUSED', () => {
    const input = createMockInputController();
    const actions = createMockGameActions(GameStatus.PAUSED);
    new GameController(input, actions);

    jest.advanceTimersByTime(1500);

    expect(actions.tick).not.toHaveBeenCalled();
  });

  it('should not call tick when IDLE', () => {
    const input = createMockInputController();
    const actions = createMockGameActions(GameStatus.IDLE);
    new GameController(input, actions);

    jest.advanceTimersByTime(1500);

    expect(actions.tick).not.toHaveBeenCalled();
  });
});

describe('GameController cleanup', () => {
  it('should stop game loop and cleanup input controller', () => {
    const input = createMockInputController();
    const actions = createMockGameActions(GameStatus.PLAYING);
    const controller = new GameController(input, actions);

    controller.cleanup();

    jest.advanceTimersByTime(1500);
    expect(actions.tick).not.toHaveBeenCalled();
    expect(input.cleanup).toHaveBeenCalledTimes(1);
  });
});

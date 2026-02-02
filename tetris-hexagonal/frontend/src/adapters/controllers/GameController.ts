import type { IInputController } from '../../domain/ports/IInputController';
import { InputAction } from '../../domain/ports/IInputController';
import type { IGameActions } from '../../domain/ports/IGameActions';
import { GameStatus } from '../../domain/types';

/**
 * Mediator pattern: coordinates IInputController and IGameActions
 * without them knowing each other. Routes input events to game actions
 * based on the current game state.
 */
export class GameController {
  private inputController: IInputController;
  private gameActions: IGameActions;
  private gameLoopInterval: number | null = null;

  constructor(
    inputController: IInputController,
    gameActions: IGameActions
  ) {
    this.inputController = inputController;
    this.gameActions = gameActions;
    this.initialize();
  }

  private initialize(): void {
    this.setupGameLoop();
    this.setupInput();
  }

  private setupGameLoop(): void {
    this.gameLoopInterval = window.setInterval(() => {
      const state = this.gameActions.getGameState();

      if (state.status === GameStatus.PLAYING) {
        this.gameActions.tick();
      }
    }, 500);
  }

  private setupInput(): void {
    this.inputController.initEventListeners((action: InputAction) => {
      const state = this.gameActions.getGameState();

      switch (action) {
        case InputAction.MOVE_LEFT:
          this.gameActions.moveLeft();
          break;
        case InputAction.MOVE_RIGHT:
          this.gameActions.moveRight();
          break;
        case InputAction.MOVE_DOWN:
          this.gameActions.moveDown();
          break;
        case InputAction.ROTATE:
          this.gameActions.rotate();
          break;
        case InputAction.DROP:
          this.gameActions.drop();
          break;
        case InputAction.PAUSE:
          if (state.status === GameStatus.PLAYING) {
            this.gameActions.pauseGame();
          } else if (state.status === GameStatus.PAUSED) {
            this.gameActions.resumeGame();
          }
          break;
      }
    });
  }

  cleanup(): void {
    if (this.gameLoopInterval !== null) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }

    this.inputController.cleanup();
  }
}

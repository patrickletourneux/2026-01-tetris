import type { IRenderer } from '../../domain/ports/IRenderer';
import type { IInputController } from '../../domain/ports/IInputController';
import { InputAction } from '../../domain/ports/IInputController';
import type { IGameActions } from '../../domain/ports/IGameActions';
import { GameStatus } from '../../domain/types';

export class GameController {
  private renderer: IRenderer;
  private inputController: IInputController;
  private gameActions: IGameActions;
  private gameLoopInterval: number | null = null;

  constructor(
    renderer: IRenderer,
    inputController: IInputController,
    gameActions: IGameActions
  ) {
    this.renderer = renderer;
    this.inputController = inputController;
    this.gameActions = gameActions;
    this.initialize();
  }

  private initialize(): void {
    this.setupRenderer();
    this.setupGameLoop();
    this.setupInput();
  }

  private setupRenderer(): void {
    setTimeout(() => {
      const canvas = document.getElementById('tetris-canvas') as HTMLCanvasElement;
      if (canvas) {
        this.renderer.initialize(canvas);
      }
    }, 0);
  }

  private setupGameLoop(): void {
    this.gameLoopInterval = window.setInterval(() => {
      const state = this.gameActions.getGameState();

      if (state.status === GameStatus.PLAYING) {
        this.gameActions.tick();
      }

      this.renderer.render(this.gameActions.getGameState());
    }, 500);
  }

  private setupInput(): void {
    this.inputController.initialize((action: InputAction) => {
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

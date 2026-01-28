import type { AppDispatch } from '../store/store';
import { CanvasRenderer } from '../../adapters/canvas/CanvasRenderer';
import {
  moveLeft,
  moveRight,
  moveDown,
  rotate,
  drop,
  tick,
  pauseGame,
  resumeGame
} from '../store/gameSlice';
import { GameStatus } from '../types';

export class GameController {
  private dispatch: AppDispatch;
  private renderer: CanvasRenderer | null = null;
  private gameLoopInterval: number | null = null;
  private keyboardHandler: ((e: KeyboardEvent) => void) | null = null;
  private gameState: any = null;

  constructor(dispatch: AppDispatch, getState: () => any) {
    this.dispatch = dispatch;
    this.gameState = getState;
    this.initialize();
  }

  private initialize(): void {
    this.setupRenderer();
    this.setupGameLoop();
    this.setupKeyboardInput();
  }

  private setupRenderer(): void {
    // Wait for DOM to be ready
    setTimeout(() => {
      const canvas = document.getElementById('tetris-canvas') as HTMLCanvasElement;
      if (canvas) {
        this.renderer = new CanvasRenderer();
        this.renderer.initialize(canvas);
      }
    }, 0);
  }

  private setupGameLoop(): void {
    this.gameLoopInterval = window.setInterval(() => {
      const state = this.gameState();

      if (state.game.status === GameStatus.PLAYING) {
        this.dispatch(tick());
      }

      // Render current state
      if (this.renderer) {
        this.renderer.render(state.game);
      }
    }, 500); // Fixed interval, game logic handles drop speed
  }

  private setupKeyboardInput(): void {
    this.keyboardHandler = (event: KeyboardEvent) => {
      const state = this.gameState();

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          this.dispatch(moveLeft());
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.dispatch(moveRight());
          break;
        case 'ArrowDown':
          event.preventDefault();
          this.dispatch(moveDown());
          break;
        case 'ArrowUp':
        case ' ':
          event.preventDefault();
          this.dispatch(rotate());
          break;
        case 'Enter':
          event.preventDefault();
          this.dispatch(drop());
          break;
        case 'p':
        case 'P':
        case 'Escape':
          event.preventDefault();
          if (state.game.status === GameStatus.PLAYING) {
            this.dispatch(pauseGame());
          } else if (state.game.status === GameStatus.PAUSED) {
            this.dispatch(resumeGame());
          }
          break;
      }
    };

    window.addEventListener('keydown', this.keyboardHandler);
  }

  cleanup(): void {
    if (this.gameLoopInterval !== null) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }

    if (this.keyboardHandler) {
      window.removeEventListener('keydown', this.keyboardHandler);
      this.keyboardHandler = null;
    }

    this.renderer = null;
  }
}

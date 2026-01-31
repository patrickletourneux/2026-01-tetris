import type { IInputController } from '../../domain/ports/IInputController';
import { InputAction } from '../../domain/ports/IInputController';

export class KeyboardInputController implements IInputController {
  private onAction: ((action: InputAction) => void) | null = null;
  private handleKeyDown: ((event: KeyboardEvent) => void) | null = null;

  initialize(onAction: (action: InputAction) => void): void {
    this.onAction = onAction;

    this.handleKeyDown = (event: KeyboardEvent) => {
      if (!this.onAction) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          this.onAction(InputAction.MOVE_LEFT);
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.onAction(InputAction.MOVE_RIGHT);
          break;
        case 'ArrowDown':
          event.preventDefault();
          this.onAction(InputAction.MOVE_DOWN);
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.onAction(InputAction.ROTATE);
          break;
        case ' ':
        case 'Enter':
          event.preventDefault();
          this.onAction(InputAction.DROP);
          break;
        case 'p':
        case 'P':
        case 'Escape':
          event.preventDefault();
          this.onAction(InputAction.PAUSE);
          break;
      }
    };

    window.addEventListener('keydown', this.handleKeyDown);
  }

  cleanup(): void {
    if (this.handleKeyDown) {
      window.removeEventListener('keydown', this.handleKeyDown);
      this.handleKeyDown = null;
    }
    this.onAction = null;
  }
}

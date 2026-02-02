export const InputAction = {
  MOVE_LEFT: 'MOVE_LEFT',
  MOVE_RIGHT: 'MOVE_RIGHT',
  MOVE_DOWN: 'MOVE_DOWN',
  ROTATE: 'ROTATE',
  DROP: 'DROP',
  PAUSE: 'PAUSE'
} as const;

export type InputAction = typeof InputAction[keyof typeof InputAction];

export interface IInputController {
  initEventListeners(onAction: (action: InputAction) => void): void;
  cleanup(): void;
}

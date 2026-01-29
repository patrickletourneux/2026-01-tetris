import type { GameState } from '../types';

export interface IRenderer {
  render(state: GameState): void;
  clear(): void;
  initialize(canvas: HTMLCanvasElement): void;
}

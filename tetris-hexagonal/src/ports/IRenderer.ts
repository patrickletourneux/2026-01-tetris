import type { GameState } from '../domain/types';

export interface IRenderer {
  render(state: GameState): void;
  clear(): void;
  initialize(canvas: HTMLCanvasElement): void;
}

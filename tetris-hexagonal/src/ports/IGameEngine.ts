import type { GameState } from '../domain/types';

export interface IGameEngine {
  start(onUpdate: (state: GameState) => void): void;
  pause(): void;
  resume(onUpdate: (state: GameState) => void): void;
  stop(): void;
  moveLeft(): void;
  moveRight(): void;
  moveDown(): void;
  rotate(): void;
  drop(): void;
  getState(): GameState;
}

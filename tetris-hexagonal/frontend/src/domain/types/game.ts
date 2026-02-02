import type { PieceShape } from './piece';
import type { Position } from './grid';

export const GameStatus = {
  IDLE: 'IDLE',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER'
} as const;

export type GameStatus = typeof GameStatus[keyof typeof GameStatus];

export interface GameState {
  status: GameStatus;
  score: number;
  level: number;
  linesCleared: number;
  grid: number[][];
  currentPiece: PieceShape | null;
  currentPosition: Position;
  ghostPosition: Position;
  nextPiece: PieceShape | null;
  gridWidth: number;
  gridHeight: number;
}

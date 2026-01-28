export interface Position {
  x: number;
  y: number;
}

export const PieceType = {
  LINE: 'LINE',        // I-piece: Straight vertical/horizontal line
  SQUARE: 'SQUARE',    // O-piece: 2x2 square
  T_SHAPE: 'T_SHAPE',  // T-piece: T-shaped piece
  S_SHAPE: 'S_SHAPE',  // S-piece: S-shaped piece
  Z_SHAPE: 'Z_SHAPE',  // Z-piece: Z-shaped piece
  J_SHAPE: 'J_SHAPE',  // J-piece: J-shaped piece
  L_SHAPE: 'L_SHAPE'   // L-piece: L-shaped piece
} as const;

export type PieceType = typeof PieceType[keyof typeof PieceType];

export interface PieceShape {
  type: PieceType;
  shape: number[][];
  color: string;
}

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
  nextPiece: PieceShape | null;
}

export const PIECE_SHAPES: Record<PieceType, { shape: number[][]; color: string }> = {
  [PieceType.LINE]: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00f0f0' // Cyan
  },
  [PieceType.SQUARE]: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#f0f000' // Yellow
  },
  [PieceType.T_SHAPE]: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#a000f0' // Purple
  },
  [PieceType.S_SHAPE]: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: '#00f000' // Green
  },
  [PieceType.Z_SHAPE]: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: '#f00000' // Red
  },
  [PieceType.J_SHAPE]: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#0000f0' // Blue
  },
  [PieceType.L_SHAPE]: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#f0a000' // Orange
  }
};

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;

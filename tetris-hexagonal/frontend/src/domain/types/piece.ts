export const PieceType = {
  LINE: 'LINE',
  SQUARE: 'SQUARE',
  T_SHAPE: 'T_SHAPE',
  S_SHAPE: 'S_SHAPE',
  Z_SHAPE: 'Z_SHAPE',
  J_SHAPE: 'J_SHAPE',
  L_SHAPE: 'L_SHAPE'
} as const;

export type PieceType = typeof PieceType[keyof typeof PieceType];

export interface PieceShape {
  type: PieceType;
  shape: number[][];
  color: string;
}

export const PIECE_SHAPES: Record<PieceType, { shape: number[][]; color: string }> = {
  [PieceType.LINE]: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00f0f0'
  },
  [PieceType.SQUARE]: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#f0f000'
  },
  [PieceType.T_SHAPE]: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#a000f0'
  },
  [PieceType.S_SHAPE]: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: '#00f000'
  },
  [PieceType.Z_SHAPE]: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: '#f00000'
  },
  [PieceType.J_SHAPE]: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#0000f0'
  },
  [PieceType.L_SHAPE]: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#f0a000'
  }
};

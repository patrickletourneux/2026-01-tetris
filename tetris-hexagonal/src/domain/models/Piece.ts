import { PieceType, PIECE_SHAPES } from '../types';
import type { PieceShape } from '../types';

export class Piece {
  private shape: number[][];
  private readonly color: string;
  private readonly type: PieceType;

  constructor(type: PieceType) {
    this.type = type;
    const pieceData = PIECE_SHAPES[type];
    this.shape = pieceData.shape.map(row => [...row]);
    this.color = pieceData.color;
  }

  getShape(): number[][] {
    return this.shape.map(row => [...row]);
  }

  getColor(): string {
    return this.color;
  }

  getType(): PieceType {
    return this.type;
  }

  rotate(): void {
    const n = this.shape.length;
    const rotated: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        rotated[j][n - 1 - i] = this.shape[i][j];
      }
    }

    this.shape = rotated;
  }

  toPieceShape(): PieceShape {
    return {
      type: this.type,
      shape: this.getShape(),
      color: this.color
    };
  }

  static random(): Piece {
    const types = Object.values(PieceType);
    const randomType = types[Math.floor(Math.random() * types.length)];
    return new Piece(randomType);
  }
}

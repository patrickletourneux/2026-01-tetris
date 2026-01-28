import { GRID_WIDTH, GRID_HEIGHT } from '../types';

export class Grid {
  private cells: number[][];

  constructor() {
    this.cells = Array(GRID_HEIGHT).fill(0).map(() => Array(GRID_WIDTH).fill(0));
  }

  getCells(): number[][] {
    return this.cells.map(row => [...row]);
  }

  isValidPosition(shape: number[][], x: number, y: number): boolean {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;

          if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) {
            return false;
          }

          if (newY >= 0 && this.cells[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  placePiece(shape: number[][], x: number, y: number, value: number): void {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;
          if (newY >= 0 && newY < GRID_HEIGHT && newX >= 0 && newX < GRID_WIDTH) {
            this.cells[newY][newX] = value;
          }
        }
      }
    }
  }

  clearLines(): number {
    let linesCleared = 0;

    for (let row = GRID_HEIGHT - 1; row >= 0; row--) {
      if (this.cells[row].every(cell => cell !== 0)) {
        this.cells.splice(row, 1);
        this.cells.unshift(Array(GRID_WIDTH).fill(0));
        linesCleared++;
        row++;
      }
    }

    return linesCleared;
  }

  reset(): void {
    this.cells = Array(GRID_HEIGHT).fill(0).map(() => Array(GRID_WIDTH).fill(0));
  }
}

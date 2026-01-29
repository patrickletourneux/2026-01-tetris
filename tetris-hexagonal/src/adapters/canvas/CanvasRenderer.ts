import type { IRenderer } from '../../domain/ports/IRenderer';
import { GRID_WIDTH, GRID_HEIGHT } from '../../domain/types';
import type { GameState } from '../../domain/types';

export class CanvasRenderer implements IRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private readonly CELL_SIZE = 30;
  private readonly BORDER_WIDTH = 2;

  initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    if (this.ctx) {
      canvas.width = GRID_WIDTH * this.CELL_SIZE + this.BORDER_WIDTH * 2;
      canvas.height = GRID_HEIGHT * this.CELL_SIZE + this.BORDER_WIDTH * 2;
    }
  }

  render(state: GameState): void {
    if (!this.ctx || !this.canvas) return;

    this.clear();
    this.drawGrid(state.grid);

    if (state.currentPiece && state.currentPosition) {
      this.drawPiece(
        state.currentPiece.shape,
        state.currentPiece.color,
        state.currentPosition.x,
        state.currentPosition.y
      );
    }
  }

  clear(): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = this.BORDER_WIDTH;
    this.ctx.strokeRect(
      this.BORDER_WIDTH / 2,
      this.BORDER_WIDTH / 2,
      this.canvas.width - this.BORDER_WIDTH,
      this.canvas.height - this.BORDER_WIDTH
    );
  }

  private drawGrid(grid: number[][]): void {
    if (!this.ctx) return;

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col]) {
          this.drawCell(col, row, '#888');
        }
      }
    }
  }

  private drawPiece(shape: number[][], color: string, x: number, y: number): void {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          this.drawCell(x + col, y + row, color);
        }
      }
    }
  }

  private drawCell(x: number, y: number, color: string): void {
    if (!this.ctx) return;

    const pixelX = x * this.CELL_SIZE + this.BORDER_WIDTH;
    const pixelY = y * this.CELL_SIZE + this.BORDER_WIDTH;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(pixelX, pixelY, this.CELL_SIZE, this.CELL_SIZE);

    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(pixelX, pixelY, this.CELL_SIZE, this.CELL_SIZE);
  }
}

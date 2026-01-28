import { GameStatus } from '../types';
import type { GameState, Position } from '../types';
import { Grid } from './Grid';
import { Piece } from './Piece';

export class Game {
  private grid: Grid;
  private currentPiece: Piece | null = null;
  private currentPosition: Position = { x: 0, y: 0 };
  private nextPiece: Piece;
  private score: number = 0;
  private level: number = 1;
  private linesCleared: number = 0;
  private status: GameStatus = GameStatus.IDLE;

  constructor() {
    this.grid = new Grid();
    this.nextPiece = Piece.random();
  }

  start(): void {
    this.status = GameStatus.PLAYING;
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.grid.reset();
    this.spawnPiece();
  }

  pause(): void {
    if (this.status === GameStatus.PLAYING) {
      this.status = GameStatus.PAUSED;
    }
  }

  resume(): void {
    if (this.status === GameStatus.PAUSED) {
      this.status = GameStatus.PLAYING;
    }
  }

  private spawnPiece(): void {
    this.currentPiece = this.nextPiece;
    this.nextPiece = Piece.random();
    this.currentPosition = { x: Math.floor(10 / 2) - Math.floor(this.currentPiece.getShape().length / 2), y: 0 };

    if (!this.grid.isValidPosition(this.currentPiece.getShape(), this.currentPosition.x, this.currentPosition.y)) {
      this.status = GameStatus.GAME_OVER;
    }
  }

  moveLeft(): boolean {
    if (this.status !== GameStatus.PLAYING || !this.currentPiece) return false;

    const newX = this.currentPosition.x - 1;
    if (this.grid.isValidPosition(this.currentPiece.getShape(), newX, this.currentPosition.y)) {
      this.currentPosition.x = newX;
      return true;
    }
    return false;
  }

  moveRight(): boolean {
    if (this.status !== GameStatus.PLAYING || !this.currentPiece) return false;

    const newX = this.currentPosition.x + 1;
    if (this.grid.isValidPosition(this.currentPiece.getShape(), newX, this.currentPosition.y)) {
      this.currentPosition.x = newX;
      return true;
    }
    return false;
  }

  moveDown(): boolean {
    if (this.status !== GameStatus.PLAYING || !this.currentPiece) return false;

    const newY = this.currentPosition.y + 1;
    if (this.grid.isValidPosition(this.currentPiece.getShape(), this.currentPosition.x, newY)) {
      this.currentPosition.y = newY;
      return true;
    } else {
      this.lockPiece();
      return false;
    }
  }

  rotate(): boolean {
    if (this.status !== GameStatus.PLAYING || !this.currentPiece) return false;

    this.currentPiece.rotate();
    if (!this.grid.isValidPosition(this.currentPiece.getShape(), this.currentPosition.x, this.currentPosition.y)) {
      this.currentPiece.rotate();
      this.currentPiece.rotate();
      this.currentPiece.rotate();
      return false;
    }
    return true;
  }

  drop(): void {
    if (this.status !== GameStatus.PLAYING || !this.currentPiece) return;

    while (this.moveDown()) {
      this.score += 2;
    }
  }

  private lockPiece(): void {
    if (!this.currentPiece) return;

    this.grid.placePiece(this.currentPiece.getShape(), this.currentPosition.x, this.currentPosition.y, 1);

    const lines = this.grid.clearLines();
    if (lines > 0) {
      this.linesCleared += lines;
      this.score += this.calculateScore(lines);
      this.level = Math.floor(this.linesCleared / 10) + 1;
    }

    this.spawnPiece();
  }

  private calculateScore(lines: number): number {
    const baseScores = [0, 100, 300, 500, 800];
    return baseScores[lines] * this.level;
  }

  getState(): GameState {
    return {
      status: this.status,
      score: this.score,
      level: this.level,
      linesCleared: this.linesCleared,
      grid: this.grid.getCells(),
      currentPiece: this.currentPiece?.toPieceShape() || null,
      currentPosition: { ...this.currentPosition },
      nextPiece: this.nextPiece.toPieceShape()
    };
  }

  getDropInterval(): number {
    return Math.max(100, 1000 - (this.level - 1) * 100);
  }
}

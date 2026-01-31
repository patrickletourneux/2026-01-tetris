import { useGameBoard } from '../adapters/hooks/useGameBoard';
import { GRID_WIDTH, GRID_HEIGHT } from '../domain/types';

const CELL_SIZE = 30;

export function GameBoard() {
  const { gameState } = useGameBoard();
  const { grid, currentPiece, currentPosition, ghostPosition } = gameState;

  const getCellColor = (row: number, col: number): string | null => {
    if (currentPiece) {
      const pieceRow = row - currentPosition.y;
      const pieceCol = col - currentPosition.x;
      if (
        pieceRow >= 0 && pieceRow < currentPiece.shape.length &&
        pieceCol >= 0 && pieceCol < currentPiece.shape[0].length &&
        currentPiece.shape[pieceRow][pieceCol]
      ) {
        return currentPiece.color;
      }

      const ghostRow = row - ghostPosition.y;
      const ghostCol = col - ghostPosition.x;
      if (
        ghostRow >= 0 && ghostRow < currentPiece.shape.length &&
        ghostCol >= 0 && ghostCol < currentPiece.shape[0].length &&
        currentPiece.shape[ghostRow][ghostCol]
      ) {
        return currentPiece.color + '40';
      }
    }
    if (grid[row]?.[col]) {
      return '#888';
    }
    return null;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
      gridTemplateRows: `repeat(${GRID_HEIGHT}, ${CELL_SIZE}px)`,
      border: '2px solid #333',
      backgroundColor: '#000',
    }}>
      {grid.map((row, rowIndex) =>
        row.map((_, colIndex) => {
          const color = getCellColor(rowIndex, colIndex);
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: color ?? '#000',
                border: color ? '1px solid #000' : 'none',
                boxSizing: 'border-box',
              }}
            />
          );
        })
      )}
    </div>
  );
}

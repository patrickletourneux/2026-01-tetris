import { GameStatus } from '../../domain/types';
import { useAppDispatch, useAppSelector } from '../../domain/store/hooks';
import { startGame, pauseGame, resumeGame } from '../../domain/store/gameSlice';

export function GameInfo() {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.game);

  const handleStart = () => dispatch(startGame());
  const handlePause = () => dispatch(pauseGame());
  const handleResume = () => dispatch(resumeGame());
  const renderNextPiece = () => {
    if (!gameState.nextPiece) return null;

    const { shape, color } = gameState.nextPiece;
    const cellSize = 20;

    return (
      <svg width={shape[0].length * cellSize} height={shape.length * cellSize}>
        {shape.map((row, rowIndex) =>
          row.map((cell, colIndex) =>
            cell ? (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * cellSize}
                y={rowIndex * cellSize}
                width={cellSize}
                height={cellSize}
                fill={color}
                stroke="#000"
                strokeWidth="1"
              />
            ) : null
          )
        )}
      </svg>
    );
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      color: '#fff',
      minWidth: '200px'
    }}>
      <h2 style={{ marginTop: 0 }}>Tetris</h2>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <strong>Score:</strong> {gameState.score}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Level:</strong> {gameState.level}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Lines:</strong> {gameState.linesCleared}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Next Piece:</strong>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          {renderNextPiece()}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {gameState.status === GameStatus.IDLE && (
          <button onClick={handleStart} style={buttonStyle}>
            Start Game
          </button>
        )}
        {gameState.status === GameStatus.PLAYING && (
          <button onClick={handlePause} style={buttonStyle}>
            Pause
          </button>
        )}
        {gameState.status === GameStatus.PAUSED && (
          <button onClick={handleResume} style={buttonStyle}>
            Resume
          </button>
        )}
        {gameState.status === GameStatus.GAME_OVER && (
          <>
            <div style={{ color: '#f00', fontWeight: 'bold', textAlign: 'center' }}>
              GAME OVER
            </div>
            <button onClick={handleStart} style={buttonStyle}>
              New Game
            </button>
          </>
        )}
      </div>

      <div style={{ marginTop: '30px', fontSize: '12px', color: '#888' }}>
        <strong>Controls:</strong>
        <div style={{ marginTop: '10px' }}>
          <div>← → : Move</div>
          <div>↓ : Soft drop</div>
          <div>↑ / Space : Rotate</div>
          <div>Enter : Hard drop</div>
          <div>P / Esc : Pause</div>
        </div>
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

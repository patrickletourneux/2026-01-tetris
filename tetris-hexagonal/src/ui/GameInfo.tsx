import { GameStatus } from '../domain/types';
import { useGameState } from '../adapters/redux/useGameState';

export function GameInfo() {
  const {
    status,
    score,
    level,
    linesCleared,
    nextPiece,
    startGame,
    pauseGame,
    resumeGame
  } = useGameState();

  const renderNextPiece = () => {
    if (!nextPiece) return null;

    const { shape, color } = nextPiece;
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
          <strong>Score:</strong> {score}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Level:</strong> {level}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Lines:</strong> {linesCleared}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Next Piece:</strong>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          {renderNextPiece()}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {status === GameStatus.IDLE && (
          <button onClick={startGame} style={buttonStyle}>
            Start Game
          </button>
        )}
        {status === GameStatus.PLAYING && (
          <button onClick={pauseGame} style={buttonStyle}>
            Pause
          </button>
        )}
        {status === GameStatus.PAUSED && (
          <button onClick={resumeGame} style={buttonStyle}>
            Resume
          </button>
        )}
        {status === GameStatus.GAME_OVER && (
          <>
            <div style={{ color: '#f00', fontWeight: 'bold', textAlign: 'center' }}>
              GAME OVER
            </div>
            <button onClick={startGame} style={buttonStyle}>
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

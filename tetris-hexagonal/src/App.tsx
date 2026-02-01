import { GameBoard } from './ui/GameBoard';
import { GameInfo } from './ui/GameInfo';
import { RssFeed } from './ui/RssFeed';
import { AuthGuard } from './ui/AuthGuard';
import { useNasaBackground } from './adapters/hooks/useNasaBackground';
import './App.css';

function App() {
  const { photo } = useNasaBackground();
  console.log(photo)

  return (
    <AuthGuard>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        backgroundImage: (photo?.hdurl || photo?.url) ? `url(${photo?.hdurl ?? photo?.url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        gap: '40px',
        padding: '20px',
        position: 'relative'
      }}>
        {(photo?.hdurl || photo?.url) && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 0
          }} />
        )}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '40px' }}>
          <GameInfo />
          <GameBoard />
          <RssFeed />
        </div>
      </div>
    </AuthGuard>
  );
}

export default App;

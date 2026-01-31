import { GameBoard } from './ui/GameBoard';
import { GameInfo } from './ui/GameInfo';
import './App.css';

function App() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      gap: '40px',
      padding: '20px'
    }}>
      <GameBoard />
      <GameInfo />
    </div>
  );
}

export default App;

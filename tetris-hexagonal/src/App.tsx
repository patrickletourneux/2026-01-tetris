import { useEffect } from 'react';
import { GameBoard } from './ui/GameBoard';
import { GameInfo } from './ui/GameInfo';
import { GameController } from './adapters/controllers/GameController';
import { KeyboardInputController } from './adapters/input/KeyboardInputController';
import { ReduxGameActions } from './adapters/redux/ReduxGameActions';
import './App.css';

function App() {
  useEffect(() => {
    const inputController = new KeyboardInputController();
    const gameActions = new ReduxGameActions();
    const controller = new GameController(inputController, gameActions);

    return () => {
      controller.cleanup();
    };
  }, []);

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

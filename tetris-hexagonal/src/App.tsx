import { useEffect } from 'react';
import { GameBoard } from './adapters/ui/GameBoard';
import { GameInfo } from './adapters/ui/GameInfo';
import { useAppDispatch } from './domain/store/hooks';
import { store } from './domain/store/store';
import { GameController } from './domain/controllers/GameController';
import './App.css';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const controller = new GameController(dispatch, () => store.getState());

    return () => {
      controller.cleanup();
    };
  }, [dispatch]);

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

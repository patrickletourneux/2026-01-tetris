import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './domain/store/store'
import { GameController } from './adapters/controllers/GameController'
import { KeyboardInputController } from './adapters/input/KeyboardInputController'
import { ReduxGameActions } from './adapters/redux/ReduxGameActions'
import './index.css'
import App from './App.tsx'

const inputController = new KeyboardInputController();
const gameActions = new ReduxGameActions();
new GameController(inputController, gameActions);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)

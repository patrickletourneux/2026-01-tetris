import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './domain/store/store'
import { GameController } from './adapters/controllers/GameController'
import { KeyboardInputController } from './adapters/input/KeyboardInputController'
import { ReduxGameActions } from './adapters/redux/ReduxGameActions'
import { ConsoleErrorHandler } from './adapters/error/ConsoleErrorHandler'
import { ErrorBoundary } from './ui/ErrorBoundary'
import './index.css'
import App from './App.tsx'

const errorHandler = new ConsoleErrorHandler();
const inputController = new KeyboardInputController();
const gameActions = new ReduxGameActions();
new GameController(inputController, gameActions);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary errorHandler={errorHandler}>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)

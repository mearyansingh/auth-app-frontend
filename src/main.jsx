import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './Store/index.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppContextProvider } from './Context/AppContext.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </StrictMode>
  </Provider>,
)

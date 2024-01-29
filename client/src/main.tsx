import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { store, persistor } from './store/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import ThemeProvider from './Components/ThemeProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </PersistGate>
  </React.StrictMode>
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AuthContextProvider from './context/AuthContext.tsx'
import { WorkoutsContextProvider } from './context/WorkoutsContext.tsx'
import { RoutinesContextProvider } from './context/RoutinesContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RoutinesContextProvider>
        <WorkoutsContextProvider>
          <App />
        </WorkoutsContextProvider>
      </RoutinesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)

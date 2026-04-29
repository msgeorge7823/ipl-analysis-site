// App entry point. Mounts the React tree into #root and enables StrictMode
// so dev-time double-renders surface unsafe lifecycle / effect patterns early.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

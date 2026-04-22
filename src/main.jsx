import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../fsa_tutorial_sim.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

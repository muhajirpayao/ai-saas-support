import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import Landpage from './pages/Landpage.jsx'
import App from './App.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

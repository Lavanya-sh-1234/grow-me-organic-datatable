import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // theme file
import 'primereact/resources/primereact.min.css';                          // core styles
import 'primeicons/primeicons.css';                          // icons


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

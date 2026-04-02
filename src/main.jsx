import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BuscadorPeliculas } from './BuscadorPeliculas'
import './styles/movieSearch.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BuscadorPeliculas />
  </StrictMode>,
)

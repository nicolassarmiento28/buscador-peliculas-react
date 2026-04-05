import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './providers/ThemeProvider';
import { MovieSearch } from './components/MovieSearch/MovieSearch';
import './styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <MovieSearch />
    </ThemeProvider>
  </StrictMode>
);

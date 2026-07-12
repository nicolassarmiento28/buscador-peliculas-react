import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { MovieSearch } from './components/MovieSearch/MovieSearch';
import { MyList } from './components/MyList/MyList';
import { PublicList } from './components/PublicList/PublicList';
import { FilmIntro } from './components/FilmIntro/FilmIntro';
import { Header } from './components/Header/Header';
import './styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <FilmIntro />
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MovieSearch />} />
          <Route path="/mi-lista" element={<MyList />} />
          <Route path="/lista/:shareSlug" element={<PublicList />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);

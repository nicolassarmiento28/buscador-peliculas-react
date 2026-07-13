import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import { MovieSearch } from './components/MovieSearch/MovieSearch';
import { MyList } from './components/MyList/MyList';
import { PublicList } from './components/PublicList/PublicList';
import { FilmIntro } from './components/FilmIntro/FilmIntro';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import './styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <FilmIntro />
        <BrowserRouter>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<MovieSearch />} />
              <Route path="/mi-lista" element={<MyList />} />
              <Route path="/lista/:shareSlug" element={<PublicList />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);

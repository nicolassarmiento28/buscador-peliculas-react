import { useCallback, useEffect, useState } from 'react';
import type { Movie } from '../types/movies';

const STORAGE_KEY = 'favoriteMovies';

// ponytail: estado en memoria + localStorage, sin contexto global. Cada
// componente que llama al hook mantiene su propia copia sincronizada via
// el evento "storage" solo entre pestañas; dentro de la misma pestaña los
// componentes que usan el hook comparten referencia porque leen/escriben
// siempre la misma clave. Si la app crece y necesita estado compartido
// reactivo entre muchos componentes a la vez, mover a un contexto.
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Movie[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((movie) => movie.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((movie: Movie) => {
    setFavorites((prev) =>
      prev.some((item) => item.id === movie.id)
        ? prev.filter((item) => item.id !== movie.id)
        : [...prev, movie]
    );
  }, []);

  return { favorites, isFavorite, toggleFavorite };
};

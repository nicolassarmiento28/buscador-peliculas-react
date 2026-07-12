import React, { useEffect, useState } from 'react';
import {
  discoverByGenre,
  getMovieRecommendations,
  searchMovies,
} from '../../services/movieApi';
import { MovieCarousel } from '../MovieCarousel/MovieCarousel';
import type { Movie, SortBy } from '../../types/movies';

interface RowFavoriteProps {
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (movie: Movie) => void;
  authRequired?: boolean;
  isSaving?: (id: number) => boolean;
}

interface SearchRowProps extends RowFavoriteProps {
  query: string;
  onError: (message: string) => void;
}

export const SearchRow: React.FC<SearchRowProps> = ({
  query,
  onError,
  ...favoriteProps
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    let cancelled = false;
    searchMovies(query)
      .then(({ movies: results }) => {
        if (!cancelled) setMovies(results);
      })
      .catch((error) => {
        if (cancelled) return;
        setMovies([]);
        onError(
          error instanceof Error
            ? error.message
            : 'Error inesperado al buscar peliculas.'
        );
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <MovieCarousel
      movies={movies}
      title={`Resultados para "${query}"`}
      {...favoriteProps}
    />
  );
};

interface GenreRowProps extends RowFavoriteProps {
  genreId: number;
  genreName: string;
  sortBy: SortBy;
}

export const GenreRow: React.FC<GenreRowProps> = ({
  genreId,
  genreName,
  sortBy,
  ...favoriteProps
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    let cancelled = false;
    discoverByGenre(genreId, sortBy)
      .then(({ movies: results }) => {
        if (!cancelled) setMovies(results);
      })
      .catch((error) =>
        console.error(`Error cargando genero "${genreName}":`, error)
      );
    return () => {
      cancelled = true;
    };
  }, [genreId, genreName, sortBy]);

  return <MovieCarousel movies={movies} title={genreName} {...favoriteProps} />;
};

interface RecommendedRowProps extends RowFavoriteProps {
  movieId: number;
}

export const RecommendedRow: React.FC<RecommendedRowProps> = ({
  movieId,
  ...favoriteProps
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    let cancelled = false;
    getMovieRecommendations(movieId)
      .then(({ movies: results }) => {
        if (!cancelled) setMovies(results);
      })
      .catch((error) =>
        console.error('Error cargando recomendaciones:', error)
      );
    return () => {
      cancelled = true;
    };
  }, [movieId]);

  return (
    <MovieCarousel
      movies={movies}
      title="Basado en tu lista"
      {...favoriteProps}
    />
  );
};

import React from 'react';
import { MovieCard } from '../MovieCard/MovieCard';
import type { Movie } from '../../types/movies';
import styles from './TrendingSection.module.css';

interface TrendingSectionProps {
  movies: Movie[];
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  movies,
  isFavorite,
  onToggleFavorite,
}) => {
  if (movies.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>En tendencia hoy</h2>
      <div className={styles.row}>
        {movies.map((movie) => (
          <div key={movie.id} className={styles.item}>
            <MovieCard
              movie={movie}
              isFavorite={isFavorite(movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

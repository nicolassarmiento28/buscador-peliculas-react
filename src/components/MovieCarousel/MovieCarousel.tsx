import React from 'react';
import { MovieCard } from '../MovieCard/MovieCard';
import type { Movie } from '../../types/movies';
import styles from './MovieCarousel.module.css';

interface MovieCarouselProps {
  movies: Movie[];
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (movie: Movie) => void;
  title?: string;
  readOnly?: boolean;
  authRequired?: boolean;
  isSaving?: (id: number) => boolean;
  id?: string;
  highlighted?: boolean;
}

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  movies,
  isFavorite,
  onToggleFavorite,
  title = 'En tendencia hoy',
  readOnly = false,
  authRequired = false,
  isSaving,
  id,
  highlighted = false,
}) => {
  if (movies.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className={`${styles.section} ${highlighted ? styles.highlight : ''}`}
    >
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.track}>
        <div className={styles.row}>
          {movies.map((movie) => (
            <div key={movie.id} className={styles.item}>
              <MovieCard
                movie={movie}
                isFavorite={isFavorite(movie.id)}
                onToggleFavorite={onToggleFavorite}
                readOnly={readOnly}
                authRequired={authRequired}
                saving={isSaving ? isSaving(movie.id) : false}
              />
            </div>
          ))}
        </div>
        <div className={styles.fade} aria-hidden="true" />
      </div>
    </section>
  );
};

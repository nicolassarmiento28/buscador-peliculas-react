import React, { useState } from 'react';
import { Card } from 'antd';
import { HeartFilled, HeartOutlined, StarFilled } from '@ant-design/icons';
import type { Movie } from '../../types/movies';
import noPoster from '../../assets/no-poster.svg';
import { MovieDetail } from './MovieDetail';
import styles from './MovieCard.module.css';

const { Meta } = Card;

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavorite,
  onToggleFavorite,
}) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : noPoster;

  const favoriteLabel = isFavorite
    ? 'Quitar de mi lista'
    : 'Agregar a mi lista';

  return (
    <>
      <Card
        hoverable
        className={styles.movieCard}
        onClick={() => setDetailOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setDetailOpen(true);
          }
        }}
        cover={
          <div className={styles.posterWrap}>
            <img
              alt={movie.title}
              src={posterUrl}
              className={styles.moviePoster}
            />
            <button
              type="button"
              className={styles.favoriteButton}
              data-active={isFavorite}
              aria-label={favoriteLabel}
              title={favoriteLabel}
              onClick={(event) => {
                event.stopPropagation();
                onToggleFavorite(movie);
              }}
            >
              {isFavorite ? <HeartFilled /> : <HeartOutlined />}
            </button>
            {movie.vote_average ? (
              <span className={styles.ratingBadge}>
                <StarFilled />
                {movie.vote_average.toFixed(1)}
              </span>
            ) : null}
          </div>
        }
      >
        <Meta title={movie.title} description={movie.overview} />
      </Card>

      <MovieDetail
        movie={movie}
        posterUrl={posterUrl}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
    </>
  );
};

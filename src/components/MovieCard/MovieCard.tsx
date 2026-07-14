import React, { useState } from 'react';
import { Card } from 'antd';
import { StarFilled } from '@ant-design/icons';
import type { Movie } from '../../types/movies';
import noPoster from '../../assets/no-poster.svg';
import { MovieDetail } from './MovieDetail';
import { FavoriteButton } from './FavoriteButton';
import styles from './MovieCard.module.css';

const { Meta } = Card;

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  readOnly?: boolean;
  authRequired?: boolean;
  saving?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavorite,
  onToggleFavorite,
  readOnly = false,
  authRequired = false,
  saving = false,
}) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : noPoster;

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
              loading="lazy"
              decoding="async"
            />
            {readOnly ? null : (
              <FavoriteButton
                movie={movie}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
                authRequired={authRequired}
                saving={saving}
                stopPropagation
              />
            )}
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
        readOnly={readOnly}
        authRequired={authRequired}
        saving={saving}
      />
    </>
  );
};

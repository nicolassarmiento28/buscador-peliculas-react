import React, { useState } from 'react';
import { Card, Modal } from 'antd';
import { StarFilled } from '@ant-design/icons';
import type { Movie } from '../../types/movies';
import noPoster from '../../assets/no-poster.svg';
import styles from './MovieCard.module.css';

const { Meta } = Card;

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
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
            />
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

      <Modal
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        title={movie.title}
      >
        <img alt={movie.title} src={posterUrl} className={styles.modalPoster} />
        {movie.release_date ? (
          <p>Fecha de estreno: {movie.release_date}</p>
        ) : null}
        {movie.vote_average ? (
          <p>
            <StarFilled /> {movie.vote_average.toFixed(1)}
          </p>
        ) : null}
        <p>{movie.overview}</p>
      </Modal>
    </>
  );
};

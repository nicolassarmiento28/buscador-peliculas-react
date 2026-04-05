import React from 'react';
import { Card } from 'antd';
import type { Movie } from '../../types/movies';
import styles from './MovieCard.module.css';

const { Meta } = Card;

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Card
      hoverable
      className={styles.movieCard}
      cover={
        <img alt={movie.title} src={posterUrl} className={styles.moviePoster} />
      }
    >
      <Meta title={movie.title} description={movie.overview} />
    </Card>
  );
};

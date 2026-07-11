import React, { useEffect, useState } from 'react';
import { Modal, Spin } from 'antd';
import { HeartFilled, HeartOutlined, StarFilled } from '@ant-design/icons';
import { getMovieCredits, getMovieVideos } from '../../services/movieApi';
import type { Cast, Movie, Video } from '../../types/movies';
import styles from './MovieCard.module.css';

const CAST_LIMIT = 9;
// ponytail: YouTube video IDs are 11 chars of [A-Za-z0-9_-]; reject anything
// else so an unexpected TMDb response can't inject into the iframe src.
const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

interface MovieDetailProps {
  movie: Movie;
  posterUrl: string;
  open: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export const MovieDetail: React.FC<MovieDetailProps> = ({
  movie,
  posterUrl,
  open,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const [cast, setCast] = useState<Cast[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([getMovieCredits(movie.id), getMovieVideos(movie.id)])
      .then(([credits, videos]) => {
        if (cancelled) {
          return;
        }
        setCast(credits.cast ?? []);
        const found = (videos.results ?? []).find(
          (video) =>
            video.site === 'YouTube' &&
            video.type === 'Trailer' &&
            YOUTUBE_ID_PATTERN.test(video.key)
        );
        setTrailer(found ?? null);
      })
      .catch((error) => {
        console.error('Error fetching movie detail:', error);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, movie.id]);

  const favoriteLabel = isFavorite
    ? 'Quitar de mi lista'
    : 'Agregar a mi lista';

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="min(920px, 92vw)"
      title={
        <span className={styles.modalTitle}>
          {movie.title}
          <button
            type="button"
            className={styles.favoriteButton}
            data-active={isFavorite}
            aria-label={favoriteLabel}
            title={favoriteLabel}
            onClick={() => onToggleFavorite(movie)}
          >
            {isFavorite ? <HeartFilled /> : <HeartOutlined />}
          </button>
        </span>
      }
    >
      <div className={styles.modalGrid}>
        <img alt={movie.title} src={posterUrl} className={styles.modalPoster} />
        <div className={styles.modalBody}>
          {movie.release_date ? (
            <p>Fecha de estreno: {movie.release_date}</p>
          ) : null}
          {movie.vote_average ? (
            <p>
              <StarFilled /> {movie.vote_average.toFixed(1)}
            </p>
          ) : null}
          <p className={styles.modalOverview}>{movie.overview}</p>

          {loading ? (
            <Spin />
          ) : (
            <>
              {trailer ? (
                <iframe
                  className={styles.trailer}
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={trailer.name}
                  allowFullScreen
                />
              ) : (
                <p className={styles.modalOverview}>
                  No hay trailer disponible.
                </p>
              )}

              {cast.length > 0 ? (
                <div className={styles.castGrid}>
                  {cast.slice(0, CAST_LIMIT).map((member) => (
                    <div key={member.id} className={styles.castMember}>
                      <p className={styles.castName}>{member.name}</p>
                      <p className={styles.castCharacter}>{member.character}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

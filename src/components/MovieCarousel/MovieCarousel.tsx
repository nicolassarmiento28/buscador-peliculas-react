import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
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

// ponytail: fallback fijo si no hay items renderizados aun para medir el ancho real
const FALLBACK_ITEM_WIDTH = 200;

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
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      row.scrollBy({ left: e.deltaY, behavior: 'auto' });
    };

    const updateScrollState = () => {
      setCanScrollLeft(row.scrollLeft > 0);
      setCanScrollRight(row.scrollLeft + row.clientWidth < row.scrollWidth - 1);
    };

    updateScrollState();
    row.addEventListener('wheel', onWheel, { passive: false });
    row.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);
    return () => {
      row.removeEventListener('wheel', onWheel);
      row.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [movies]);

  const scrollByItems = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    const itemWidth =
      row.querySelector<HTMLElement>('[class*="item"]')?.getBoundingClientRect()
        .width ?? FALLBACK_ITEM_WIDTH;
    row.scrollBy({ left: direction * itemWidth * 3, behavior: 'smooth' });
  };

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
        <Button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          shape="circle"
          icon={<LeftOutlined />}
          onClick={() => scrollByItems(-1)}
          disabled={!canScrollLeft}
          aria-label="Desplazar a la izquierda"
        />
        <div className={styles.row} ref={rowRef}>
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
        <Button
          className={`${styles.arrow} ${styles.arrowRight}`}
          shape="circle"
          icon={<RightOutlined />}
          onClick={() => scrollByItems(1)}
          disabled={!canScrollRight}
          aria-label="Desplazar a la derecha"
        />
        <div className={styles.fade} aria-hidden="true" />
      </div>
    </section>
  );
};

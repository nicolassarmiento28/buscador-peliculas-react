import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Empty, Button } from 'antd';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { MovieCard } from '../MovieCard/MovieCard';
import { MovieCarousel } from '../MovieCarousel/MovieCarousel';
import { getMovieRecommendations } from '../../services/movieApi';
import type { Movie } from '../../types/movies';
import styles from './PublicList.module.css';

interface ListItem {
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
}

type LoadState = 'loading' | 'unavailable' | 'ready';

export const PublicList: React.FC = () => {
  const { shareSlug } = useParams<{ shareSlug: string }>();
  const [state, setState] = useState<LoadState>('loading');
  const [items, setItems] = useState<ListItem[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);

  useEffect(() => {
    if (!shareSlug) {
      setState('unavailable');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        // Query por el campo shareSlug (el id de doc ahora es el uid del
        // dueno, no el slug) filtrando isPublic para no exponer listas
        // privadas ni depender de reglas de seguridad para ocultarlas.
        const listSnap = await getDocs(
          query(
            collection(db, 'lists'),
            where('shareSlug', '==', shareSlug),
            where('isPublic', '==', true)
          )
        );
        if (cancelled) return;

        if (listSnap.empty) {
          setState('unavailable');
          return;
        }

        const listId = listSnap.docs[0].id;
        const itemsSnap = await getDocs(
          collection(db, 'lists', listId, 'items')
        );
        if (cancelled) return;

        const listItems = itemsSnap.docs.map((docSnap) => ({
          movieId: docSnap.data().movieId as number,
          movieTitle: docSnap.data().movieTitle as string,
          posterPath: (docSnap.data().posterPath ?? null) as string | null,
        }));
        setItems(listItems);
        setState('ready');

        if (listItems.length > 0) {
          const { movies } = await getMovieRecommendations(
            listItems[0].movieId
          );
          if (!cancelled) setRecommendations(movies);
        }
      } catch (error) {
        console.error('Error cargando la lista publica:', error);
        if (!cancelled) setState('unavailable');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [shareSlug]);

  if (state === 'loading') {
    return null;
  }

  if (state === 'unavailable') {
    return (
      <div className={styles.container}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Esta lista no esta disponible"
        >
          <Link to="/">
            <Button type="primary">Volver al inicio</Button>
          </Link>
        </Empty>
      </div>
    );
  }

  const movies: Movie[] = items.map((item) => ({
    id: item.movieId,
    title: item.movieTitle,
    overview: '',
    poster_path: item.posterPath,
  }));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista compartida</h1>
      <Row gutter={[22, 22]} className={styles.movieList}>
        {movies.map((movie) => (
          <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={6}>
            <MovieCard
              movie={movie}
              isFavorite={false}
              onToggleFavorite={() => {}}
              readOnly
            />
          </Col>
        ))}
      </Row>

      <MovieCarousel
        movies={recommendations}
        isFavorite={() => false}
        onToggleFavorite={() => {}}
        title="Recomendaciones"
        readOnly
      />
    </div>
  );
};

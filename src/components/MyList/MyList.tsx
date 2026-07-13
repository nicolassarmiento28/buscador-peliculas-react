import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Switch, Input, Button, Typography, message } from 'antd';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useMyList } from '../../hooks/useMyList';
import { MovieCard } from '../MovieCard/MovieCard';
import { AuthButton } from '../AuthButton/AuthButton';
import type { Movie } from '../../types/movies';
import styles from './MyList.module.css';

const { Text } = Typography;

interface MyListItem {
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
}

export const MyList: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { shareSlug, isFavorite, isSaving, toggleFavorite } = useMyList(user);
  const [items, setItems] = useState<MyListItem[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(db, 'lists', user.uid), (snapshot) => {
      setIsPublic(Boolean(snapshot.data()?.isPublic));
    });
  }, [user]);

  // ponytail: onSnapshot propio (en vez de reusar los items de useMyList)
  // porque esta vista necesita movieTitle/posterPath, que useMyList no
  // expone al ser generico para el boton de favorito en cualquier pagina.
  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      collection(db, 'lists', user.uid, 'items'),
      (snapshot) => {
        setItems(
          snapshot.docs.map((docSnap) => ({
            movieId: docSnap.data().movieId,
            movieTitle: docSnap.data().movieTitle,
            posterPath: docSnap.data().posterPath ?? null,
          }))
        );
      }
    );
  }, [user]);

  const handleTogglePublic = (checked: boolean) => {
    if (!user) return;
    setIsPublic(checked);
    updateDoc(doc(db, 'lists', user.uid), { isPublic: checked }).catch(
      (error) =>
        console.error('Error actualizando visibilidad de la lista:', error)
    );
  };

  const handleCopy = () => {
    if (!shareSlug) return;
    const link = `${window.location.origin}/lista/${shareSlug}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
        message.success('Link copiado');
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((error) => console.error('Error copiando el link:', error));
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <Button
          shape="circle"
          icon={<ArrowLeftOutlined />}
          aria-label="Volver a la pagina principal"
          onClick={() => navigate('/')}
        />
        <div className={styles.emptyState}>
          <Text className={styles.emptyText}>
            Inicia sesión para ver tu lista de películas
          </Text>
          <AuthButton />
        </div>
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
      <Button
        shape="circle"
        icon={<ArrowLeftOutlined />}
        aria-label="Volver a la pagina principal"
        onClick={() => navigate('/')}
      />
      <div className={styles.header}>
        <h1 className={styles.title}>Mi lista</h1>
        <Switch
          checked={isPublic}
          onChange={handleTogglePublic}
          checkedChildren="Publica"
          unCheckedChildren="Privada"
        />
      </div>

      {isPublic && shareSlug ? (
        <div className={styles.shareRow}>
          <Input
            readOnly
            value={`${window.location.origin}/lista/${shareSlug}`}
          />
          <Button
            onClick={handleCopy}
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            className={copied ? styles.copiedButton : undefined}
          >
            {copied ? 'Copiado' : 'Copiar'}
          </Button>
        </div>
      ) : null}

      {movies.length === 0 ? (
        <div className={styles.emptyState}>
          <Text className={styles.emptyText}>Tu lista esta vacia.</Text>
          <Link to="/">
            <Button type="primary">Buscar peliculas</Button>
          </Link>
        </div>
      ) : (
        <Row gutter={[22, 22]} className={styles.movieList}>
          {movies.map((movie) => (
            <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <MovieCard
                movie={movie}
                isFavorite={isFavorite(movie.id)}
                onToggleFavorite={toggleFavorite}
                saving={isSaving(movie.id)}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import {
  Input,
  Button,
  Row,
  Col,
  Typography,
  Empty,
  Alert,
  Pagination,
} from 'antd';
import { SearchOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useMyList } from '../../hooks/useMyList';
import {
  searchMovies,
  getTrending,
  discoverByGenre,
} from '../../services/movieApi';
import { MovieCard } from '../MovieCard/MovieCard';
import { TrendingSection } from '../TrendingSection/TrendingSection';
import { GenreChips } from '../GenreChips/GenreChips';
import type { Movie, SortBy } from '../../types/movies';
import styles from './MovieSearch.module.css';
import cardStyles from '../MovieCard/MovieCard.module.css';

const { Title } = Typography;
const { Search } = Input;

const DEBOUNCE_MS = 450;
const SKELETON_COUNT = 8;

export const MovieSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [activeGenreId, setActiveGenreId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('popularity.desc');
  const [page, setPage] = useState<number>(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [trending, setTrending] = useState<Movie[]>([]);
  const { user } = useAuth();
  const { isFavorite, isSaving, toggleFavorite } = useMyList(user);

  useEffect(() => {
    getTrending()
      .then(({ movies: results }) => setTrending(results))
      .catch((error) =>
        console.error('Error fetching trending movies:', error)
      );
  }, []);

  const runSearch = async (value: string, targetPage: number) => {
    if (!value.trim()) {
      setMovies([]);
      setTotalPages(0);
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    try {
      const { movies: results, totalPages: pages } = await searchMovies(
        value,
        targetPage
      );
      setMovies(results);
      setTotalPages(pages);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error inesperado al buscar peliculas.';
      setErrorMessage(message);
      setMovies([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const runDiscover = async (
    genreId: number,
    sort: SortBy,
    targetPage: number
  ) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const { movies: results, totalPages: pages } = await discoverByGenre(
        genreId,
        sort,
        targetPage
      );
      setMovies(results);
      setTotalPages(pages);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error inesperado al buscar peliculas.';
      setErrorMessage(message);
      setMovies([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Busqueda con debounce al tipear; reinicia a pagina 1 en cada cambio de query.
  useEffect(() => {
    if (activeGenreId !== null) {
      return;
    }
    const timer = setTimeout(() => {
      setPage(1);
      runSearch(query, 1);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, activeGenreId]);

  const handleSearch = (value: string) => {
    setActiveGenreId(null);
    setPage(1);
    runSearch(value, 1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    if (activeGenreId !== null) {
      runDiscover(activeGenreId, sortBy, nextPage);
    } else {
      runSearch(query, nextPage);
    }
  };

  const handleSelectGenre = (genreId: number) => {
    setQuery('');
    setActiveGenreId(genreId);
    setPage(1);
    runDiscover(genreId, sortBy, 1);
  };

  const handleSortChange = (nextSortBy: SortBy) => {
    setSortBy(nextSortBy);
    if (activeGenreId !== null) {
      setPage(1);
      runDiscover(activeGenreId, nextSortBy, 1);
    }
  };

  const isBrowsing = !query.trim() && activeGenreId === null;

  return (
    <div className={styles.container}>
      <Title level={1} className={styles.title}>
        Buscador de Películas
      </Title>
      <span className={styles.subtitle}>Explora el catálogo de TMDb</span>

      <div className={styles.searchContainer}>
        <Search
          placeholder="Busca una película..."
          enterButton={
            <Button type="primary" icon={<SearchOutlined />}>
              Buscar
            </Button>
          }
          size="large"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={handleSearch}
          loading={loading}
          className={styles.searchInput}
          aria-label="Buscar película por título"
        />
      </div>

      <GenreChips
        activeGenreId={activeGenreId}
        sortBy={sortBy}
        onSelectGenre={handleSelectGenre}
        onSortChange={handleSortChange}
      />

      {errorMessage ? (
        <Alert
          type="error"
          showIcon
          message="No se pudo consultar TMDb"
          description={errorMessage}
          className={styles.errorAlert}
        />
      ) : null}

      {isBrowsing ? (
        <TrendingSection
          movies={trending}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          authRequired={!user}
          isSaving={isSaving}
        />
      ) : null}

      {loading ? (
        <Row gutter={[22, 22]} className={styles.skeletonList}>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={6}>
              <div className={cardStyles.skeletonCard}>
                <div className={cardStyles.skeletonPoster} />
                <div className={cardStyles.skeletonLine} />
                <div className={cardStyles.skeletonLine} />
              </div>
            </Col>
          ))}
        </Row>
      ) : movies.length > 0 ? (
        <>
          <Row gutter={[22, 22]} className={styles.movieList}>
            {movies.map((movie) => (
              <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <MovieCard
                  movie={movie}
                  isFavorite={isFavorite(movie.id)}
                  onToggleFavorite={toggleFavorite}
                  authRequired={!user}
                  saving={isSaving(movie.id)}
                />
              </Col>
            ))}
          </Row>
          {totalPages > 1 ? (
            <Pagination
              current={page}
              total={Math.min(totalPages, 500)}
              pageSize={1}
              onChange={handlePageChange}
              className={styles.pagination}
              showSizeChanger={false}
            />
          ) : null}
        </>
      ) : query || activeGenreId !== null ? (
        <Empty
          description="No se encontraron películas"
          className={styles.empty}
        />
      ) : (
        <div className={styles.emptyState}>
          <VideoCameraOutlined className={styles.emptyStateIcon} />
          <p className={styles.emptyStateTitle}>Empieza tu búsqueda</p>
          <p className={styles.emptyStateText}>
            Escribe el título de una película para descubrir su información en
            TMDb.
          </p>
        </div>
      )}
    </div>
  );
};

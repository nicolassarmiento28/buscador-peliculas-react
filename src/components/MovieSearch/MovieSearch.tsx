import React, { useEffect, useState } from 'react';
import { Input, Button, Typography, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useMyList } from '../../hooks/useMyList';
import { useFirstListMovieId } from '../../hooks/useFirstListMovieId';
import { getTrending } from '../../services/movieApi';
import { MovieCarousel } from '../MovieCarousel/MovieCarousel';
import { GenreChips } from '../GenreChips/GenreChips';
import { GenreRow, RecommendedRow, SearchRow } from './MovieRows';
import { GENRES } from '../../constants/genres';
import type { Movie, SortBy } from '../../types/movies';
import styles from './MovieSearch.module.css';

const { Title } = Typography;
const { Search } = Input;

const DEBOUNCE_MS = 450;

export const MovieSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [activeGenreIds, setActiveGenreIds] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('popularity.desc');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [trending, setTrending] = useState<Movie[]>([]);
  const { user } = useAuth();
  const { isFavorite, isSaving, toggleFavorite } = useMyList(user);
  const firstListMovieId = useFirstListMovieId(user);

  useEffect(() => {
    getTrending()
      .then(({ movies: results }) => setTrending(results))
      .catch((error) =>
        console.error('Error fetching trending movies:', error)
      );
  }, []);

  // Busqueda con debounce al tipear.
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage(null);
      setDebouncedQuery(query.trim());
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  const handleToggleGenre = (genreId: number) => {
    setActiveGenreIds((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const favoriteProps = {
    isFavorite,
    onToggleFavorite: toggleFavorite,
    authRequired: !user,
    isSaving,
  };

  const isSearching = debouncedQuery.length > 0;

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
          className={styles.searchInput}
          aria-label="Buscar película por título"
        />
      </div>

      <GenreChips
        activeGenreIds={activeGenreIds}
        sortBy={sortBy}
        onSelectGenre={handleToggleGenre}
        onSortChange={setSortBy}
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

      {isSearching ? (
        <SearchRow
          query={debouncedQuery}
          onError={setErrorMessage}
          {...favoriteProps}
        />
      ) : (
        <>
          <MovieCarousel
            movies={trending}
            title="En tendencia hoy"
            {...favoriteProps}
          />

          {user && firstListMovieId ? (
            <RecommendedRow movieId={firstListMovieId} {...favoriteProps} />
          ) : null}

          {activeGenreIds.map((genreId) => {
            const genre = GENRES.find((item) => item.id === genreId);
            if (!genre) return null;
            return (
              <GenreRow
                key={genreId}
                genreId={genreId}
                genreName={genre.name}
                sortBy={sortBy}
                {...favoriteProps}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

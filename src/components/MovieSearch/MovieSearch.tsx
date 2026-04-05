import React, { useState } from 'react';
import { Input, Button, Row, Col, Typography, Empty, Spin } from 'antd';
import { SearchOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../../hooks/useTheme';
import { searchMovies } from '../../services/movieApi';
import { MovieCard } from '../MovieCard/MovieCard';
import type { Movie } from '../../types/movies';
import styles from './MovieSearch.module.css';

const { Title } = Typography;
const { Search } = Input;

export const MovieSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();

  const handleSearch = async (value: string) => {
    if (!value.trim()) return;

    setLoading(true);
    try {
      const results = await searchMovies(value);
      setMovies(results);
    } catch (error) {
      console.error('Error searching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Button
        className={styles.themeToggle}
        onClick={toggleTheme}
        icon={theme === 'dark' ? <BulbOutlined /> : <BulbFilled />}
        shape="circle"
        size="large"
        title={`Cambiar a ${theme === 'dark' ? 'light' : 'dark'} mode`}
      />

      <Title level={1} className={styles.title}>
        Buscador de Películas
      </Title>

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
        />
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : movies.length > 0 ? (
        <Row gutter={[22, 22]} className={styles.movieList}>
          {movies.map((movie) => (
            <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      ) : query && !loading ? (
        <Empty
          description="No se encontraron películas"
          className={styles.empty}
        />
      ) : null}
    </div>
  );
};

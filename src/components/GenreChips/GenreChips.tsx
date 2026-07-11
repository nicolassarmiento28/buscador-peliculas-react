import React from 'react';
import { Segmented } from 'antd';
import { GENRES } from '../../constants/genres';
import type { SortBy } from '../../types/movies';
import styles from './GenreChips.module.css';

const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: 'Popularidad', value: 'popularity.desc' },
  { label: 'Mejor valoradas', value: 'vote_average.desc' },
  { label: 'Mas recientes', value: 'primary_release_date.desc' },
];

interface GenreChipsProps {
  activeGenreId: number | null;
  sortBy: SortBy;
  onSelectGenre: (genreId: number) => void;
  onSortChange: (sortBy: SortBy) => void;
}

export const GenreChips: React.FC<GenreChipsProps> = ({
  activeGenreId,
  sortBy,
  onSelectGenre,
  onSortChange,
}) => {
  return (
    <div className={styles.chipsRow}>
      {GENRES.map((genre) => (
        <button
          key={genre.id}
          type="button"
          className={styles.chip}
          data-active={activeGenreId === genre.id}
          aria-pressed={activeGenreId === genre.id}
          onClick={() => onSelectGenre(genre.id)}
        >
          {genre.name}
        </button>
      ))}
      <Segmented
        className={styles.sortSegmented}
        value={sortBy}
        options={SORT_OPTIONS}
        onChange={(value) => onSortChange(value as SortBy)}
      />
    </div>
  );
};

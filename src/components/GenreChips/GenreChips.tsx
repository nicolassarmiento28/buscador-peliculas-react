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
  activeGenreIds: number[];
  sortBy: SortBy;
  onSelectGenre: (genreId: number) => void;
  onSortChange: (sortBy: SortBy) => void;
}

export const GenreChips: React.FC<GenreChipsProps> = ({
  activeGenreIds,
  sortBy,
  onSelectGenre,
  onSortChange,
}) => {
  return (
    <div className={styles.chipsRow}>
      {GENRES.map((genre) => {
        const isActive = activeGenreIds.includes(genre.id);
        return (
          <button
            key={genre.id}
            type="button"
            className={styles.chip}
            data-active={isActive}
            aria-pressed={isActive}
            onClick={() => onSelectGenre(genre.id)}
          >
            {genre.name}
          </button>
        );
      })}
      <Segmented
        className={styles.sortSegmented}
        value={sortBy}
        options={SORT_OPTIONS}
        onChange={(value) => onSortChange(value as SortBy)}
      />
    </div>
  );
};

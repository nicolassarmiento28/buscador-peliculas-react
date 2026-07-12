import React, { useState } from 'react';
import { Popover } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import type { Movie } from '../../types/movies';
import styles from './MovieCard.module.css';

interface FavoriteButtonProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  authRequired?: boolean;
  saving?: boolean;
  className?: string;
  stopPropagation?: boolean;
}

// Boton de corazon compartido entre MovieCard y MovieDetail (mismo estilo,
// mismo data-active). Si el usuario no esta logueado (authRequired) el click
// no togglea nada, solo muestra un aviso para iniciar sesion.
export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  movie,
  isFavorite,
  onToggleFavorite,
  authRequired = false,
  saving = false,
  className,
  stopPropagation = false,
}) => {
  const [promptOpen, setPromptOpen] = useState(false);
  const label = isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos';

  const button = (
    <button
      type="button"
      className={className ?? styles.favoriteButton}
      data-active={isFavorite}
      data-saving={saving}
      aria-pressed={isFavorite}
      aria-label={label}
      title={label}
      disabled={saving}
      onClick={(event) => {
        if (stopPropagation) {
          event.stopPropagation();
        }
        if (authRequired) {
          setPromptOpen(true);
          return;
        }
        onToggleFavorite(movie);
      }}
    >
      {isFavorite ? <HeartFilled /> : <HeartOutlined />}
    </button>
  );

  if (!authRequired) {
    return button;
  }

  return (
    <Popover
      content="Inicia sesion para guardar en tu lista"
      trigger="click"
      open={promptOpen}
      onOpenChange={setPromptOpen}
    >
      {button}
    </Popover>
  );
};

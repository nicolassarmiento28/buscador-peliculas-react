import { useEffect, useState } from 'react';
import type { FC } from 'react';
import styles from './FilmIntro.module.css';

const STORAGE_KEY = 'film-intro-shown';

export const FilmIntro: FC = () => {
  const [visible, setVisible] = useState(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    return !sessionStorage.getItem(STORAGE_KEY);
  });

  useEffect(() => {
    if (visible) sessionStorage.setItem(STORAGE_KEY, '1');
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={styles.overlay}
      onAnimationEnd={(event) => {
        if (event.animationName === 'film-fadeout') setVisible(false);
      }}
    />
  );
};

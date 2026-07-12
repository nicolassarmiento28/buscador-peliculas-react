import { useEffect, useRef, useState } from 'react';
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
  const [skipping, setSkipping] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) sessionStorage.setItem(STORAGE_KEY, '1');
  }, [visible]);

  useEffect(() => {
    if (visible) overlayRef.current?.focus();
  }, [visible]);

  if (!visible) return null;

  const skip = () => setSkipping(true);

  return (
    <div
      ref={overlayRef}
      role="button"
      tabIndex={0}
      aria-label="Saltar introduccion"
      className={`${styles.overlay} ${skipping ? styles.skipping : ''}`}
      onClick={skip}
      onKeyDown={(event) => {
        if (
          event.key === 'Escape' ||
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault();
          skip();
        }
      }}
      onAnimationEnd={(event) => {
        if (
          event.animationName === 'film-fadeout' ||
          event.animationName === 'film-fadeout-fast'
        ) {
          setVisible(false);
        }
      }}
    >
      <span className={styles.skipHint}>Toca para continuar</span>
    </div>
  );
};

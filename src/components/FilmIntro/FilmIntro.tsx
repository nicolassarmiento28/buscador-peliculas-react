import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import styles from './FilmIntro.module.css';

const STORAGE_KEY = 'film-intro-shown';

// Guard a nivel de modulo: sessionStorage por si solo ya evita que se
// repita entre recargas, pero esto ademas bloquea cualquier segundo
// montaje dentro de la MISMA carga de pagina (ej. un remount inesperado
// del arbol), marcando la bandera de forma sincronica antes de que el
// primer montaje siquiera termine de renderizar.
let hasPlayedThisPageLoad = false;

export const FilmIntro: FC = () => {
  const [visible, setVisible] = useState(() => {
    if (hasPlayedThisPageLoad) return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    if (sessionStorage.getItem(STORAGE_KEY)) return false;

    hasPlayedThisPageLoad = true;
    sessionStorage.setItem(STORAGE_KEY, '1');
    return true;
  });
  const [skipping, setSkipping] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

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
        if (event.animationName === 'film-fadeout') {
          setVisible(false);
        }
      }}
      onTransitionEnd={(event) => {
        if (event.propertyName === 'opacity') {
          setVisible(false);
        }
      }}
    >
      <span className={styles.skipHint}>Toca para continuar</span>
    </div>
  );
};

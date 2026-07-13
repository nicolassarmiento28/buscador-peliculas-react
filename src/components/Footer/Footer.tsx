import type { FC } from 'react';
import styles from './Footer.module.css';

export const Footer: FC = () => (
  <footer className={styles.footer}>
    <span className={styles.brand}>Buscador de Películas</span>
    <span className={styles.copy}>
      Función de cortesía del proyector · datos de{' '}
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noreferrer"
        className={styles.link}
      >
        TMDb
      </a>
    </span>
    <span className={styles.year}>© {new Date().getFullYear()}</span>
  </footer>
);

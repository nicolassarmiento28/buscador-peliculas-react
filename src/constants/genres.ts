import type { Genre } from '../types/movies';

// ponytail: subconjunto fijo de generos comunes de TMDb, no vale la pena
// pedir la lista completa a /genre/movie/list para este alcance.
export const GENRES: Genre[] = [
  { id: 28, name: 'Acción' },
  { id: 35, name: 'Comedia' },
  { id: 27, name: 'Terror' },
  { id: 18, name: 'Drama' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Ciencia ficción' },
  { id: 16, name: 'Animación' },
  { id: 53, name: 'Suspenso' },
];

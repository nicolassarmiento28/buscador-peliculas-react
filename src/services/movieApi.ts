import type { Movie, MovieSearchResponse } from '../types/movies';

const API_BASE_URL = 'https://api.themoviedb.org/3/search/movie';
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    if (!query.trim()) {
      return [];
    }

    if (!API_TOKEN) {
      throw new Error(
        'No se encontro VITE_TMDB_API_TOKEN. Configura la variable de entorno y vuelve a desplegar.'
      );
    }

    const response = await fetch(
      `${API_BASE_URL}?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
      }
    );

    if (!response.ok) {
      let apiMessage = '';

      try {
        const errorData = await response.json();
        if (errorData?.status_message) {
          apiMessage = ` - ${errorData.status_message}`;
        }
      } catch {
        // Ignore JSON parse errors and keep a generic message.
      }

      throw new Error(`HTTP ${response.status}${apiMessage}`);
    }

    const data: MovieSearchResponse = await response.json();
    return data.results ?? [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

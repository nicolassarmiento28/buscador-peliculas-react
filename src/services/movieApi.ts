import type { Movie, MovieSearchResponse } from '../types/movies';

const API_BASE_URL = 'https://api.themoviedb.org/3/search/movie';
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    if (!query.trim()) {
      return [];
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MovieSearchResponse = await response.json();
    return data.results ?? [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

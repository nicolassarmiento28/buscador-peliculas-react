import type { Movie, MovieSearchResponse } from '../types/movies';

export interface MovieSearchResult {
  movies: Movie[];
  totalPages: number;
}

export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<MovieSearchResult> => {
  try {
    if (!query.trim()) {
      return { movies: [], totalPages: 0 };
    }

    const response = await fetch(
      `/api/search?query=${encodeURIComponent(query)}&page=${page}`
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
    return { movies: data.results ?? [], totalPages: data.total_pages ?? 0 };
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

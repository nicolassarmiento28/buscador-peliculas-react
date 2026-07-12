import type {
  CreditsResponse,
  Movie,
  MovieSearchResponse,
  SortBy,
  VideosResponse,
} from '../types/movies';

export interface MovieSearchResult {
  movies: Movie[];
  totalPages: number;
}

const readJsonErrorMessage = async (response: Response): Promise<string> => {
  try {
    const errorData = await response.json();
    return errorData?.status_message ? ` - ${errorData.status_message}` : '';
  } catch {
    return '';
  }
};

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
      const apiMessage = await readJsonErrorMessage(response);
      throw new Error(`HTTP ${response.status}${apiMessage}`);
    }

    const data: MovieSearchResponse = await response.json();
    return { movies: data.results ?? [], totalPages: data.total_pages ?? 0 };
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const getTrending = async (
  page: number = 1
): Promise<MovieSearchResult> => {
  try {
    const response = await fetch(`/api/movies?type=trending&page=${page}`);
    if (!response.ok) {
      const apiMessage = await readJsonErrorMessage(response);
      throw new Error(`HTTP ${response.status}${apiMessage}`);
    }
    const data: MovieSearchResponse = await response.json();
    return { movies: data.results ?? [], totalPages: data.total_pages ?? 0 };
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const getTopRated = async (
  page: number = 1
): Promise<MovieSearchResult> => {
  try {
    const response = await fetch(`/api/movies?type=top_rated&page=${page}`);
    if (!response.ok) {
      const apiMessage = await readJsonErrorMessage(response);
      throw new Error(`HTTP ${response.status}${apiMessage}`);
    }
    const data: MovieSearchResponse = await response.json();
    return { movies: data.results ?? [], totalPages: data.total_pages ?? 0 };
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

export const getUpcoming = async (
  page: number = 1
): Promise<MovieSearchResult> => {
  try {
    const response = await fetch(`/api/movies?type=upcoming&page=${page}`);
    if (!response.ok) {
      const apiMessage = await readJsonErrorMessage(response);
      throw new Error(`HTTP ${response.status}${apiMessage}`);
    }
    const data: MovieSearchResponse = await response.json();
    return { movies: data.results ?? [], totalPages: data.total_pages ?? 0 };
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};

export const discoverByGenre = async (
  genreId: number,
  sortBy: SortBy = 'popularity.desc',
  page: number = 1
): Promise<MovieSearchResult> => {
  try {
    const response = await fetch(
      `/api/movies?type=discover&genre_id=${genreId}&sort_by=${encodeURIComponent(sortBy)}&page=${page}`
    );
    if (!response.ok) {
      const apiMessage = await readJsonErrorMessage(response);
      throw new Error(`HTTP ${response.status}${apiMessage}`);
    }
    const data: MovieSearchResponse = await response.json();
    return { movies: data.results ?? [], totalPages: data.total_pages ?? 0 };
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

export const getMovieCredits = async (id: number): Promise<CreditsResponse> => {
  try {
    const response = await fetch(`/api/movies?type=credits&id=${id}`);
    if (!response.ok) {
      const apiMessage = await readJsonErrorMessage(response);
      throw new Error(`HTTP ${response.status}${apiMessage}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    throw error;
  }
};

export const getMovieVideos = async (id: number): Promise<VideosResponse> => {
  try {
    const response = await fetch(`/api/movies?type=videos&id=${id}`);
    if (!response.ok) {
      const apiMessage = await readJsonErrorMessage(response);
      throw new Error(`HTTP ${response.status}${apiMessage}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    throw error;
  }
};

export const getMovieRecommendations = async (
  id: number
): Promise<MovieSearchResult> => {
  try {
    const response = await fetch(`/api/movies?type=recommendations&id=${id}`);
    if (!response.ok) {
      const apiMessage = await readJsonErrorMessage(response);
      throw new Error(`HTTP ${response.status}${apiMessage}`);
    }
    const data: MovieSearchResponse = await response.json();
    return { movies: data.results ?? [], totalPages: data.total_pages ?? 0 };
  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    throw error;
  }
};

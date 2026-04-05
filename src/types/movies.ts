export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
  backdrop_path?: string | null;
  popularity?: number;
  vote_count?: number;
  adult?: boolean;
  genre_ids?: number[];
  original_language?: string;
  original_title?: string;
  video?: boolean;
}

export interface MovieSearchResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export type Theme = 'light' | 'dark';

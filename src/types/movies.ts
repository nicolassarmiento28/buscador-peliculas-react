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

export type SortBy =
  | 'popularity.desc'
  | 'vote_average.desc'
  | 'primary_release_date.desc';

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CreditsResponse {
  id: number;
  cast: Cast[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface VideosResponse {
  id: number;
  results: Video[];
}

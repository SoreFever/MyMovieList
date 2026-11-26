import { STATUS_LABEL, RATING } from "@/constants";
export type SearchResult = {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
};
export type Status = keyof typeof STATUS_LABEL;
export type Rating = (typeof RATING)[number];
export type Entry = {
  id: string;
  tmdb_id: string;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  status: Status;
  rating: Rating | null;
  episodes_watched: number | null;
  notes: string | null;
  release_date: string;
};
export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};
export type MediaDetail = {
  id: number;
  title?: string;
  name?: string;
  tagline: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  runtime?: number | null;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  vote_average: number;
  poster_path: string | null;
  genres: { id: number; name: string }[];
  credits: {
    cast: CastMember[];
  };
};
export type Item = {
  tmdb_id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string | null;
};

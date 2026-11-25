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

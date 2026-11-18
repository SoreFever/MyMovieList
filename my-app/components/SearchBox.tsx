"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PosterGrid from "./PosterGrid";
import PosterImage from "./PosterImage";

type SearchResult = {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
};

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // wait before the user stops typing
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(
          (data.results ?? []).filter(
            (r: SearchResult) =>
              r.media_type == "movie" || r.media_type == "tv",
          ),
        );
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="px-6">
      <div className="mx-auto mt-8 max-w-[500px]">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies and TV..."
          className="w-full p-2"
        />
      </div>

      {loading && <p>Searching...</p>}

      <PosterGrid>
        {results.map((m) => {
          const title = m.title ?? m.name ?? "Untitled";
          const date = m.release_date ?? m.first_air_date;

          return (
            <Link
              key={`${m.media_type}-${m.id}`}
              href={`/${m.media_type}/${m.id}`}
              className="text-inherit no-underline"
            >
              <div>
                <PosterImage
                  path={m.poster_path}
                  alt={title}
                  fallbackText="No poster"
                />

                <div className="mt-1.5">
                  <strong className="text-sm">{title}</strong>
                  <div className="text-xs opacity-70">
                    {date?.slice(0, 4)} ·{" "}
                    {m.media_type === "tv" ? "TV" : "Movie"}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </PosterGrid>
    </div>
  );
}

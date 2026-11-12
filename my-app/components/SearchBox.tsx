"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PosterGrid from "./PosterGrid";
import PosterImage from "./PosterImage";

type Movie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
};

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
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
        setResults(data.results ?? []);
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
          placeholder="Search movies..."
          className="w-full p-2"
        />
      </div>

      {loading && <p>Searching...</p>}

      <PosterGrid>
        {results.map((m) => (
          <Link
            key={m.id}
            href={`/movie/${m.id}`}
            className="text-inherit no-underline"
          >
            <div>
              <PosterImage
                path={m.poster_path}
                alt={m.title}
                fallbackText="No poster"
              />

              <div className="mt-1.5">
                <strong className="text-sm">{m.title}</strong>
                <div className="text-xs opacity-70">
                  {m.release_date?.slice(0, 4)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </PosterGrid>
    </div>
  );
}

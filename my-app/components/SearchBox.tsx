"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <div style={{ padding: "0 24px" }}>
      <div style={{ maxWidth: 500, margin: "2rem auto 0" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      {loading && <p>Searching...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        {results.map((m) => (
          <Link
            key={m.id}
            href={`/movie/${m.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div>
              {m.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                  alt={m.title}
                  style={{ width: "100%", borderRadius: 8, display: "block" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "2/3",
                    background: "#333",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "#aaa",
                  }}
                >
                  No poster
                </div>
              )}
              <div style={{ marginTop: 6 }}>
                <strong style={{ fontSize: 14 }}>{m.title}</strong>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {m.release_date?.slice(0, 4)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

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
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        style={{ width: "100%", padding: 8 }}
      />

      {loading && <p>Searching...</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((m) => (
          <li key={m.id} style={{ display: "flex", gap: 12, margin: "12px 0" }}>
            {m.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                alt={m.title}
                width={46}
              />
            )}
            <div>
              <strong>{m.title}</strong>
              <div>{m.release_date?.slice(0, 4)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

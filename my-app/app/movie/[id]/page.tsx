import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type MovieDetail = {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  poster_path: string;
  genres: { id: number; name: string }[];
};

async function getMovie(id: string): Promise<MovieDetail | null> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
      accept: "application/json",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default function MoviePage({
  params,
}: {
  params: Promise<{id: string}>
}) {
  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "0 16px" }}>
      <Link href="/">Back to search</Link>
      <Suspense fallback={<p style={{marginTop: 24}}>Loading...</p>}>
        <MovieContent params={params} />
      </Suspense>
    </div>
  )
}

async function MovieContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovie(id);

  if (!movie) notFound();

  return (
      <div
        style={{ display: "flex", gap: 24, marginTop: 24, flexWrap: "wrap" }}
      >
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{
              width: 300,
              maxWidth: "100%",
              borderRadius: 8,
              alignSelf: "flex-start",
            }}
          />
        ) : (
          <div
            style={{
              width: 300,
              aspectRatio: "2/3",
              background: "#333",
              borderRadius: 8,
            }}
          />
        )}

        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 className="text-3xl font-bold">
            {movie.title}{" "}
            <span className="font-normal opacity-60">
              ({movie.release_date?.slice(0, 4)})
            </span>
          </h1>

          {movie.tagline && (
            <p style={{ fontStyle: "italic", opacity: 0.7 }}>{movie.tagline}</p>
          )}

          <p>
            * {movie.vote_average.toFixed(1)}
            {movie.runtime ? ` . ${movie.runtime} min` : ""}
          </p>

          <p>{movie.genres.map((g) => g.name).join(", ")}</p>

          <h3 className="mt-6 text-xl font-semibold">Overview</h3>
          <p>{movie.overview || "No overview available."}</p>
        </div>
      </div>
  );
}

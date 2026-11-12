import PosterGrid from "@/components/PosterGrid";
import PosterImage from "@/components/PosterImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

type MovieDetail = {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  poster_path: string | null;
  genres: { id: number; name: string }[];
  credits: {
    cast: CastMember[];
  };
};

async function getMovie(id: string): Promise<MovieDetail | null> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
        accept: "application/json",
      },
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) return null;
  return res.json();
}

export default function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="mx-auto my-8 max-w-[900px] px-4">
      <Link href="/">Back to search</Link>
      <Suspense fallback={<p className="mt-6">Loading...</p>}>
        <MovieContent params={params} />
      </Suspense>
    </div>
  );
}

async function MovieContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovie(id);

  if (!movie) notFound();

  const mainCast = movie.credits.cast
    .sort((a, b) => a.order - b.order)
    .slice(0, 12);

  return (
    <div>
      <div className="mt-6 flex flex-wrap gap-6">
        <div className="w-[300px] max-w-full self-start">
          <PosterImage
            path={movie.poster_path}
            alt={movie.title}
            size="w500"
            fallbackText="No poster"
          />
        </div>

        <div className="min-w-[260px] flex-1">
          <h1 className="text-3xl font-bold">
            {movie.title}{" "}
            <span className="font-normal opacity-60">
              ({movie.release_date?.slice(0, 4)})
            </span>
          </h1>

          {movie.tagline && (
            <p className="mt-2 italic opacity-70">{movie.tagline}</p>
          )}

          <p className="mt-2">
            ⭐ {movie.vote_average.toFixed(1)}
            {movie.runtime ? ` • ${movie.runtime} min` : ""}
          </p>

          <p className="mt-2">{movie.genres.map((g) => g.name).join(", ")}</p>

          <h3 className="mt-6 text-xl font-semibold">Overview</h3>
          <p className="mt-2">{movie.overview || "No overview available."}</p>
        </div>
      </div>

      <PosterGrid>
        {mainCast.map((c) => (
          <div key={c.id}>
            <PosterImage
              path={c.profile_path}
              alt={c.name}
              fallbackText="No photo"
            />

            <div className="mt-1.5">
              <div className="text-sm font-semibold">{c.character}</div>
              <div className="text-sm opacity-70">{c.name}</div>
            </div>
          </div>
        ))}
      </PosterGrid>
    </div>
  );
}

import AddEntryButton from "@/components/AddEntryButton";
import DeleteEntryButton from "@/components/DeleteEntryButton";
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

type TvDetail = {
  id: number;
  name: string;
  tagline: string;
  overview: string;
  first_air_date: string;
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  vote_average: number;
  poster_path: string | null;
  genres: { id: number; name: string }[];
  credits: {
    cast: CastMember[];
  };
};

async function getShow(id: string): Promise<TvDetail | null> {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?append_to_response=credits`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
        accept: "application/json",
      },
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) {
    console.log("TMDB tv fetch failed:", res.status, await res.text());
    return null;
  }
  return res.json();
}

export default function ShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="mx-auto my-8 max-w-[900px] px-4">
      <Link href="/">Back to search</Link>
      <Suspense fallback={<p className="mt-6">Loading...</p>}>
        <ShowContent params={params} />
      </Suspense>
    </div>
  );
}

async function ShowContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const show = await getShow(id);

  if (!show) notFound();

  const mainCast = show.credits.cast
    .sort((a, b) => a.order - b.order)
    .slice(0, 12);

  const runtime = show.episode_run_time?.[0];

  return (
    <div>
      <div className="mt-6 flex flex-wrap gap-6">
        <div className="w-[300px] max-w-full self-start">
          <PosterImage
            path={show.poster_path}
            alt={show.name}
            size="w500"
            fallbackText="No poster"
          />
        </div>

        <div className="min-w-[260px] flex-1">
          <h1 className="text-3xl font-bold">
            {show.name}{" "}
            <span className="font-normal opacity-60">
              ({show.first_air_date?.slice(0, 4)})
            </span>
          </h1>

          {show.tagline && (
            <p className="mt-2 italic opacity-70">{show.tagline}</p>
          )}

          <p className="mt-2">
            ⭐ {show.vote_average.toFixed(1)}
            {runtime ? ` • ${runtime} min/episode` : ""}
          </p>

          <p className="mt-2">
            {show.number_of_seasons} season{show.number_of_seasons !== 1 && "s"}
            {" • "}
            {show.number_of_episodes} episode
            {show.number_of_episodes !== 1 && "s"}
          </p>

          <p className="mt-2">{show.genres.map((g) => g.name).join(", ")}</p>

          <h3 className="mt-6 text-xl font-semibold">Overview</h3>
          <p className="mt-2">{show.overview || "No overview available."}</p>
          <AddEntryButton
            item={{
              tmdb_id: show.id,
              media_type: "tv",
              title: show.name,
              poster_path: show.poster_path,
            }}
          />
          <DeleteEntryButton id={id} media_type="tv"/>
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

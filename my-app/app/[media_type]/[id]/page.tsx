import AddEntryButton from "@/components/AddEntryButton";
import DeleteEntryButton from "@/components/DeleteEntryButton";
import PosterGrid from "@/components/PosterGrid";
import PosterImage from "@/components/PosterImage";
import { MediaDetail } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function getMedia(
  media_type: string,
  id: string,
): Promise<MediaDetail | null> {
  const res = await fetch(
    `https://api.themoviedb.org/3/${media_type}/${id}?append_to_response=credits`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
        accept: "application/json",
      },
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) {
    console.log(
      `TMDB ${media_type} fetch failed:`,
      res.status,
      await res.text(),
    );
    return null;
  }
  return res.json();
}

export default function MediaPage({
  params,
}: {
  params: Promise<{ media_type: string; id: string }>;
}) {
  return (
    <div className="mx-auto my-8 max-w-[900px] px-4">
      <Link href="/">Back to search</Link>
      <Suspense fallback={<p className="mt-6">Loading...</p>}>
        <MediaContent params={params} />
      </Suspense>
    </div>
  );
}

async function MediaContent({
  params,
}: {
  params: Promise<{ media_type: string; id: string }>;
}) {
  const { media_type, id } = await params;
  const show = await getMedia(media_type, id);

  if (!show) notFound();

  const mainCast = show.credits.cast
    .sort((a, b) => a.order - b.order)
    .slice(0, 12);

  const runtime =
    media_type === "tv" ? show.episode_run_time?.[0] : show.runtime;

  return (
    <div>
      <div className="mt-6 flex flex-wrap gap-6">
        <div className="w-[300px] max-w-full self-start">
          {media_type === "tv" ? (
            <PosterImage
              path={show.poster_path}
              alt={show.name}
              size="w500"
              fallbackText="No poster"
            />
          ) : (
            <PosterImage
              path={show.poster_path}
              alt={show.title}
              size="w500"
              fallbackText="No poster"
            />
          )}
        </div>

        <div className="min-w-[260px] flex-1">
          {media_type === "tv" ? (
            <h1 className="text-3xl font-bold">
              {show.name}{" "}
              <span className="font-normal opacity-60">
                ({show.first_air_date?.slice(0, 4)})
              </span>
            </h1>
          ) : (
            <h1 className="text-3xl font-bold">
              {show.title}{" "}
              <span className="font-normal opacity-60">
                ({show.release_date?.slice(0, 4)})
              </span>
            </h1>
          )}

          {show.tagline && (
            <p className="mt-2 italic opacity-70">{show.tagline}</p>
          )}

          <p className="mt-2">
            ⭐ {show.vote_average.toFixed(1)}
            {runtime ? ` • ${runtime} min/episode` : ""}
          </p>

          {media_type === "tv" ? (
            <p className="mt-2">
              {show.number_of_seasons} season
              {show.number_of_seasons !== 1 && "s"}
              {" • "}
              {show.number_of_episodes} episode
              {show.number_of_episodes !== 1 && "s"}
            </p>
          ) : (
            <></>
          )}

          <p className="mt-2">{show.genres.map((g) => g.name).join(", ")}</p>

          <h3 className="mt-6 text-xl font-semibold">Overview</h3>
          <p className="mt-2">{show.overview || "No overview available."}</p>
          {media_type === "tv" ? (
            <>
              <AddEntryButton
                item={{
                  tmdb_id: show.id,
                  media_type: "tv",
                  title: show.name,
                  poster_path: show.poster_path,
                  release_date: show.first_air_date,
                }}
              />
              <DeleteEntryButton id={id} media_type="tv" />
            </>
          ) : (
            <>
              <AddEntryButton
                item={{
                  tmdb_id: show.id,
                  media_type: "movie",
                  title: show.title,
                  poster_path: show.poster_path,
                  release_date: show.release_date,
                }}
              />
              <DeleteEntryButton id={id} media_type="movie" />
            </>
          )}
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

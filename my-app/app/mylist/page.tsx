import { createClient } from "../lib/supabase-server";
import Link from "next/link";
import PosterImage from "@/components/PosterImage";
import { redirect } from "next/navigation";

type SearchResult = {
  tmdb_id: number;
  media_type: "movie" | "tv";
  title?: string;
  release_date?: string;
  poster_path: string | null;
};

export default async function MyList() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("list_entries")
    .select()
    .eq("user_id", user.id);

  if (error) {
    return <p>Failed to load your list: {error.message}</p>;
  }

  const list = (data ?? []) as SearchResult[];
  return (
    <table className="w-full">
      <thead>
        <tr className="text-left text-sm opacity-70">
          <th></th>
          <th>Title</th>
          <th>Year</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {list.map((m) => {
          const title = m.title ?? "Untitled";
          const year = m.release_date?.slice(0, 4);

          return (
            <tr key={`${m.media_type}-${m.tmdb_id}`} className="border-b">
              <td className="py-2 pr-3">
                <Link href={`/${m.media_type}/${m.tmdb_id}`}>
                  <div className="w-12">
                    <PosterImage
                      path={m.poster_path}
                      alt={title}
                      fallbackText="No poster"
                    />
                  </div>
                </Link>
              </td>
              <td>
                <Link href={`${m.media_type}/${m.tmdb_id}`} className="font-medium">
                  {title}
                </Link>
              </td>
              <td>{year}</td>
              <td>{m.media_type === "tv" ? "TV" : "Movie"}</td>
              <td>
                <Link href={`/mylist/edit/${m.media_type}/${m.tmdb_id}`}>Edit</Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

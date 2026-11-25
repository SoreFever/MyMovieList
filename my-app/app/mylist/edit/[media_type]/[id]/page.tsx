import { createClient } from "@/app/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import EditEntry from "./EditEntry";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string; media_type: string }>;
}) {
  const { id, media_type } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("list_entries")
    .select(
      "id, tmdb_id, media_type, title, poster_path, status, rating, episodes_watched, notes, release_date",
    )
    .match({ user_id: user.id, tmdb_id: id, media_type: media_type })
    .maybeSingle();

  if (!entry) notFound();

  return <EditEntry entry={entry} />;
}

import { createClient } from "@/app/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import EditEntry from "./EditEntry";

export default async function EditPage({
  params,
}: {
  params: Promise<{ media_type: string; tmdb_id: string }>;
}) {
  const { media_type, tmdb_id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("list_entries")
    .select("id, tmdb_id, media_type, status, rating, episodes, notes")
    .eq("user_id", user.id)
    .eq("media_type", media_type)
    .eq("tmdb_id", Number(tmdb_id))
    .maybeSingle();

  if (!entry) notFound();

  return <EditEntry entry={entry} />;
}

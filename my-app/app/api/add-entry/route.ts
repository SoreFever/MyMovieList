import { createClient } from "@/app/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "You need to be logged in." },
      { status: 401 },
    );
  }

  const item = await req.json();
  if (!item?.tmdb_id || !item?.media_type) {
    return NextResponse.json(
      { error: "Missing entry id or media type." },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("list_entries").insert({
    user_id: user.id,
    tmdb_id: item.tmdb_id,
    media_type: item.media_type,
    title: item.title,
    poster_path: item.poster_path,
    release_date: item.release_date,
  });

  if (error?.code === "23505") {
    return NextResponse.json(
      { error: "Already in your list." },
      { status: 409 },
    );
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

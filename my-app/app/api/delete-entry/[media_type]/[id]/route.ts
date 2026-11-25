import { createClient } from "@/app/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; media_type: string }>;
  },
) {
  const { media_type, id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing tmdb id." }, { status: 400 });
  }
  if (!media_type) {
    return NextResponse.json({ error: "Missing media type." }, { status: 400 });
  }

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

  const { error, data } = await supabase
    .from("list_entries")
    .delete()
    .match({ user_id: user.id, tmdb_id: id, media_type: media_type })
    .select()
    .maybeSingle();

  if (error) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}

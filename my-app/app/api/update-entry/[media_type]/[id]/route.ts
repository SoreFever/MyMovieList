import { createClient } from "@/app/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";
import { Status, Rating } from "@/types";
import { STATUS_LABEL, RATING } from "@/constants";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; media_type: string }> },
) {
  const { id, media_type } = await params;
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

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  // Only allow fields you actually want to edit
  const { status, rating, episodes, notes } = body;
  const updates: {
    status?: Status;
    rating?: Rating | null;
    episodes_watched?: number | null;
    notes?: string;
  } = {};

  if (status !== undefined) {
    if (!(status in STATUS_LABEL)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    updates.status = status;
  }

  if (rating !== undefined) {
    if (rating !== null && !RATING.includes(rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }
    updates.rating = rating;
  }

  if (episodes !== undefined) {
    if (
      episodes !== null &&
      (!Number.isInteger(episodes) || episodes < 0)
    ) {
      return NextResponse.json({ error: "Invalid episodes" }, { status: 400 });
    }
    updates.episodes_watched = episodes;
  }

  if (notes !== undefined) {
    if (typeof notes !== "string") {
      return NextResponse.json({ error: "Invalid notes" }, { status: 400 });
    }
    updates.notes = notes;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("list_entries")
    .update(updates)
    .match({ user_id: user.id, tmdb_id: id, media_type: media_type })
    .select()
    .maybeSingle();

  if (error) {
    console.error("Update failed:", error.message);
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
  return NextResponse.json(data, { status: 200 });
}

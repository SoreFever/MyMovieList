import { createClient } from "@/app/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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

  const STATUS_LABEL = {
  plan_to_watch: "Plan to Watch",
  watching: "Watching",
  completed: "Completed",
  dropped: "Dropped",
};
type Status = keyof typeof STATUS_LABEL;

const RATING = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
type Rating = (typeof RATING)[number];

  // Only allow fields you actually want to edit
  const { status, rating, episodes, notes } = body;
  const updates:  { 
    status?: Status;
    rating?: Rating | null;
    episodes?: number | null,
    notes?: string
   } = {};
  
  if (status !== undefined) {
    if (!(status in STATUS_LABEL)) {
      return NextResponse.json({error: "Invalid status"},{status: 400})
    }
    updates.status;
  }

  if (rating !== undefined) {
    if (rating !== null && !RATING.includes(rating)) {
      return NextResponse.json({error: "Invalid rating"},{status: 400})
    }
    updates.rating;
  }

  if (episodes !== undefined) {
    if (episodes !== null && (!Number.isInteger(episodes) || episodes < 0)) {
      return NextResponse.json({error: "Invalid episodes"},{status: 400})
    }
    updates.episodes;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({error: "No fields to update"},{status: 400})
  }

  const { data, error } = await supabase
    .from("list_entries")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
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

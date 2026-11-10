import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ results: [] });

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
        accept: "application/json",
      },
    },
  );

  if (!res.ok)
    return NextResponse.json(
      { error: "TMDB request failed" },
      { status: res.status },
    );
  return NextResponse.json(await res.json());
}

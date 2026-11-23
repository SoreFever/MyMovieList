"use client";

type Item = {
  tmdb_id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date: string | null;
};

export default function AddEntryButton({item}: {item: Item}) {
  async function handleClick() {
    const res = await fetch("/api/add-entry", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(item)
    })

    const data = await res.json()

    if (!res.ok) console.log(data.error);
    console.log("Added: ", item.title)
  }
  return <button onClick={() => handleClick()}>Add to list</button>;
}

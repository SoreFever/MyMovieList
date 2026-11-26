"use client";

import { Item } from "@/types";

export default function AddEntryButton({ item }: { item: Item }) {
  async function handleClick() {
    const res = await fetch("/api/add-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    const data = await res.json();

    if (!res.ok) console.log(data.error);
    console.log("Added: ", item.title);
  }
  return <button onClick={() => handleClick()}>Add to list</button>;
}

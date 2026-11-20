"use client";

export default function DeleteEntryButton({ id, media_type }: { id: string, media_type: string }) {
  async function handleClick() {
    const res = await fetch(`/api/delete-entry/${media_type}/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      console.log(data.error);
      return;
    }
    console.log(data)
  }
  return <button onClick={() => handleClick()}>Remove to list</button>;
}

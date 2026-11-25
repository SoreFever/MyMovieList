"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Entry, Status, Rating } from "@/types";
import { STATUS_LABEL, RATING } from "@/constants";

export default function EditEntry({ entry }: { entry: Entry }) {
  const router = useRouter();

  const [status, setStatus] = useState<Status>(entry.status);
  const [rating, setRating] = useState<Rating | null>(entry.rating);
  const [episodes, setEpisodes] = useState<number | null>(entry.episodes_watched);
  const [notes, setNotes] = useState(entry.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(
      `/api/update-entry/${entry.media_type}/${entry.tmdb_id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rating, episodes, notes }),
      },
    );

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong");
      return;
    }

    router.push("/mylist");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as Status)}
      >
        {Object.entries(STATUS_LABEL).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={episodes ?? ""}
        onChange={(e) =>
          setEpisodes(e.target.value === "" ? 0 : Number(e.target.value))
        }
      />

      <select
        value={rating ?? ""}
        onChange={(e) =>
          setRating(
            e.target.value === "" ? null : (Number(e.target.value) as Rating),
          )
        }
      >
        <option value="">No rating</option>
        {RATING.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      ></textarea>
      {error && <p>{error}</p>}
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

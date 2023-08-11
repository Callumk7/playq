"use client";

import { useState } from "react";
import { Button } from "../ui/button";

export default function AddPlaylistForm() {
  const [playlistName, setPlaylistName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`/api/playlists/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: playlistName }),
    });

    if (res.ok) {
      console.log("playlist created")
      setPlaylistName("")
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-row items-center space-x-3">
      <input
        type="text"
        name="playlist name"
        className="rounded-md border bg-inherit px-4 py-2 focus:border-foreground"
        value={playlistName}
        placeholder="Best RPGs in town.."
        onChange={(e) => setPlaylistName(e.target.value)}
      />
      <Button variant={"outline"} size={"sm"}>
        Add
      </Button>
    </form>
  );
}
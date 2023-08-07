import { GameSearchResult, IGDBImage } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { SearchToast } from "./toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SearchResultProps {
  game: GameSearchResult;
  handleSave: (gameId: number) => Promise<void>;
  handleRemove: (gameId: number) => Promise<void>;
}

export function SearchResult({ game, handleSave, handleRemove }: SearchResultProps) {
  const [saveToastOpen, setSaveToastOpen] = useState(false);
  const [removeToastOpen, setRemoveToastOpen] = useState(false);

  const handleSaveClicked = async () => {
    await handleSave(game.id);
    setSaveToastOpen(true);
  };

  const handleRemoveClicked = async () => {
    await handleRemove(game.id);
    setRemoveToastOpen(true);
  };

  // image size fetched from IGDB
  const size: IGDBImage = "screenshot_med";

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-lg border text-foreground animate-in hover:border-foreground">
      <Link href={`/games/${game.id}`}>
        <Image
          src={`https://images.igdb.com/igdb/image/upload/t_${size}/${game.artworks[0].image_id}.jpg`}
          alt="cover image"
          width={569}
          height={320}
        />
      </Link>
      <div className="p-2">
        <h1 className="mb-1 font-bold">{game.name}</h1>
        {game.genres && <p className="text-sm opacity-70">{game.genres[0].name}</p>}
      </div>
      {game.isInCollectionOrSaving === false && (
        <Button
          className="absolute bottom-4 right-4"
          variant={"default"}
          onClick={handleSaveClicked}
        >
          save
        </Button>
      )}
      {game.isInCollectionOrSaving === "saving" && (
        <Button className="absolute bottom-4 right-4" variant={"ghost"}>
          saving..
        </Button>
      )}
      {game.isInCollectionOrSaving === "removing" && (
        <Button className="absolute bottom-4 right-4" variant={"ghost"}>
          removing..
        </Button>
      )}
      {game.isInCollectionOrSaving === true && (
        <Button
          className="absolute bottom-4 right-4"
          variant={"destructive"}
          onClick={handleRemoveClicked}
        >
          remove
        </Button>
      )}

      <SearchToast
        title={`${game.name} added`}
        content="Find it in your collection, go now?"
        toastOpen={saveToastOpen}
        setToastOpen={setSaveToastOpen}
      ></SearchToast>
    </div>
  );
}

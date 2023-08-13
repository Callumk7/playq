import { getRecentGames } from "@/lib/prisma/games/queries";
import { IGDBImage } from "@/types";
import Image from "next/image";

const size: IGDBImage = "cover_big";

export default async function Home() {
  const recentGames = await getRecentGames(5);
  
  return (
    <main className="mx-auto w-4/5">
      <h1 className="text-2xl font-bold">Recent Games</h1>
      <div className="flex flex-wrap gap-2 justify-center">
        {recentGames.map((gc, index) => (
          <Image
            key={index}
            alt={gc.game.title}
            src={`https://images.igdb.com/igdb/image/upload/t_${size}/${
              gc.game.cover!.imageId
            }.jpg`}
            width={264}
            height={374}
          ></Image>
        ))}
      </div>
    </main>
  );
}

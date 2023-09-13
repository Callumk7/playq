import { options } from "@/app/api/auth/[...nextauth]/options";
import { ClientCollectionContainer } from "@/features/collection/components/ClientCollectionContainer";
import { getFullCollection } from "@/features/collection/hooks/queries";
import {
  getAllPlaylistsWithGames,
  getPlaylists,
} from "@/features/playlists/hooks/queries";
import { getUserGenres } from "@/lib/hooks/genres/queries";
import { getServerSession } from "next-auth";

export default async function CollectionPage({ params }: { params: { userId: string } }) {
  const session = await getServerSession(options);
  if (!session) {
    return <div>time to login..</div>;
  }

  const userId = session.user.id;

  if (userId !== params.userId) {
    // TODO: handle seeing other peoples collections if they are not private
    return <h1>NOT YOU, GET OUT</h1>;
  }

  const [genres, fullCollection, playlists] = await Promise.all([
    getUserGenres(userId),
    getFullCollection(userId), // collection -> games -> playlists
    getAllPlaylistsWithGames(userId),
  ]);

  return (
    <div className="min-h-screen w-full justify-self-center">
      <ClientCollectionContainer
        userId={userId}
        genres={genres}
        fullCollection={fullCollection}
        playlists={playlists}
      />
    </div>
  );
}

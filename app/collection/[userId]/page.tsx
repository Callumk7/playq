import { getPlaylists } from "@/features/playlists/queries/prisma-functions";
import { ClientCollectionContainer } from "@/features/collection/components/ClientCollectionContainer";
import {
  getFullCollection,
  getUserGenres,
} from "@/features/collection/queries/prisma-functions";

export const revalidate = 300;

export default async function CollectionPage({ params }: { params: { userId: string } }) {
  const userId = "user_2Tmlvj4Ju83ZYElhXRg9pNjvakf";
  if (userId !== params.userId) {
    // TODO: handle seeing other peoples collections if they are not private
    return <h1>NOT YOU, GET OUT</h1>;
  }

  const [genres, collection, playlists] = await Promise.all([
    getUserGenres(userId),
    getFullCollection(userId),
    getPlaylists(userId),
  ]);

  return (
    <main className="mx-auto flex min-h-screen flex-col items-center space-y-10 animate-in">
      <ClientCollectionContainer
        userId={userId}
        collection={collection}
        genres={genres}
        playlists={playlists}
      />
    </main>
  );
}

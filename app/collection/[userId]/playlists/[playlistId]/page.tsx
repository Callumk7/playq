import { PlaylistContainer } from "@/features/playlists/components/PlaylistContainer";
import { getGamesFromPlaylist } from "@/features/playlists/hooks/queries";
import { getUserGenres } from "@/lib/hooks/genres/queries";

export default async function PlaylistPage({
  params,
}: {
  params: { userId: string; playlistId: string };
}) {
  const playlistId = Number(params.playlistId);
  const userId = params.userId;

  const [games, genres] = await Promise.all([
    getGamesFromPlaylist(Number(params.playlistId)),
    getUserGenres(userId),
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center space-y-10 animate-in">
      <PlaylistContainer
        userId={userId}
        playlistId={playlistId}
        games={games}
        genres={genres}
      />
    </main>
  );
}

import { getMostRecentGames } from "@/features/dashboard/hooks/queries";
import { SearchResultEntryControls } from "@/features/search/components/SearchResultEntryControls";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { CoverView } from "@/components/games/CoverView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerSession(options);
  const games = await getMostRecentGames();
  if (!session) {
    return (
      <div>
        <p>Time to login</p>
      </div>
    );
  }
  if (session) {
    const userId = session.user.id;
    return (
      <main className="flex flex-col space-y-10">
        <div className="flex flex-col space-y-3">
          <h2>Top rated games</h2>
          <CoverView games={games} selectedGames={[]} ControlComponent={SearchResultEntryControls} controlProps={{userId}} />
        </div>
      </main>
    );
  }
}

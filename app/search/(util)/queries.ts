import { prisma } from "@/lib/prisma/client";

export async function getSearchResults(q: string): Promise<unknown> {
	const res = await fetch(process.env.IGDB_URL!, {
		method: "POST",
		headers: {
			"Client-ID": process.env.IGDB_CLIENT_ID!,
			Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
			"content-type": "text/plain",
		},
		body: `search "${q}"; fields name, artworks.image_id, screenshots.image_id, aggregated_rating, aggregated_rating_count, cover.image_id, storyline, first_release_date, genres.name; limit 40; where artworks != null & cover.image_id != null;`,
		cache: "force-cache",
	});
	console.log("IGDB fetch completed");

	// this is unknown, as we do not know shape of return
	return res.json();
}

export async function getCollectionGameIds(userId: string | null): Promise<number[]> {
	if (!userId) {
		return [];
	}

	const findCollection = await prisma.userGameCollection.findMany({
		where: {
			userId,
		},
		select: {
			gameId: true,
		},
	});

	const results = [];
	for (const result of findCollection) {
		results.push(result.gameId);
	}
	console.log("get collection completed");
	return results;
}
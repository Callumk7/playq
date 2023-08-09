import { prisma } from "@/lib/prisma/client";

export async function getCollection(userId: string) {
	console.time("get collection");
	const userCollection = await prisma.userGameCollection.findMany({
		where: {
			userId,
		},
		include: {
			game: {
				include: {
					cover: true,
					genres: {
						include: {
							genre: true,
						},
					},
					artworks: true,
					screenshots: true,
				},
			},
		},
	});

	console.timeEnd("get collection");
	return userCollection;
}

export async function getCollectionGameIds(userId: string): Promise<number[]> {
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
	return results;
}

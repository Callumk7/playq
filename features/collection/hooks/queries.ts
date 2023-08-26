import { prisma } from "@/lib/clients/prisma";
import { CollectionWithGamesGenresPlaylists } from "@/types";
import { useQuery } from "@tanstack/react-query";

///
/// FETCH FULL COLLECTION: PRISMA, FETCH REQUEST, REACT QUERY
///
export async function getFullCollection(
	userId: string
): Promise<CollectionWithGamesGenresPlaylists[]> {
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
					playlists: {
						include: {
							playlist: true,
						},
					},
				},
			},
		},
	});

	console.timeEnd("get collection");
	return userCollection;
}

async function fetchFullCollection(
	userId: string
): Promise<CollectionWithGamesGenresPlaylists[]> {
	const res = await fetch(`/api/collection?userId=${userId}`, {
		method: "GET",
	});

	if (!res.ok) {
		throw new Error("Network response was not ok");
	}

	const data = await res.json();
	return data as CollectionWithGamesGenresPlaylists[];
}

export const useCollectionQuery = (
	userId: string,
	initialData?: CollectionWithGamesGenresPlaylists[]
) => {
	const collectionQuery = useQuery({
		queryKey: ["collection", userId],
		queryFn: () => fetchFullCollection(userId),
		initialData: initialData,
	});

	return collectionQuery;
};

///
/// FETCH COLLECTION IDS: PRISMA, FETCH REQUEST, REACT QUERY
///
async function fetchCollectionGameIds(userId: string): Promise<number[]> {
	const res = await fetch(`/api/collection/ids?userId=${userId}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
		},
	});

	if (!res.ok) {
		throw new Error("Network response was not ok");
	}

	const data = await res.json();
	return data as number[];
}

export const useCollectionGameIdsQuery = (userId: string, initialData?: number[]) => {
	const collectionIdsQuery = useQuery({
		queryKey: ["collection", userId, { selectIds: true }],
		queryFn: () => fetchCollectionGameIds(userId),
		initialData: initialData,
	});

	return collectionIdsQuery;
};
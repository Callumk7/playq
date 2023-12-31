import { prisma } from "@/lib/clients/prisma";
import { queryClient } from "@/lib/clients/react-query";
import { GameWithCoverAndGenres, PlaylistWithGames } from "@/types";
import { Playlist, PlaylistsOnGames } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

/// CREATE A NEW PLAYLIST
const postPlaylist = async (userId: string, playlistName: string) => {
	const body = { name: playlistName };
	console.log(body);
	const res = await fetch(`/api/playlists?userId=${userId}`, {
		method: "post",
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		throw new Error("Network response was not ok");
	}

	const data = await res.json();
	console.log(data);
	return data as Playlist;
};

export const useAddPlaylist = (userId: string) => {
	console.log(userId);
	const addMutation = useMutation({
		mutationFn: (playlistName: string) => {
			console.log("adding playlist..");
			queryClient.invalidateQueries(["playlists", userId]);
			return postPlaylist(userId, playlistName);
		},

		onSuccess: (playlist) => {
			console.log(`success ${playlist.name} created`);
			const oldState = queryClient.getQueryData([
				"playlists",
				userId,
			]) as Playlist[];
			queryClient.setQueryData(["playlists", userId], [...oldState, playlist]);
		},
	});

	return addMutation;
};

/// DELETE A PLAYLIST, INCLUDING THE ENTRIES IN THE PLAYLISTONGAMESTABLE
export async function deletePlaylist(playlistId: number) {
	const deletedPlaylist = await prisma.playlist.delete({
		where: {
			id: playlistId,
		},
	});

	return deletedPlaylist;
}

const deletePlaylistRequest = async (playlistId: number) => {
	const res = await fetch(`/api/playlists?playlistId=${playlistId}`, {
		method: "DELETE",
	});

	if (!res.ok) {
		throw new Error("Network response was not ok");
	}

	const data = await res.json();
	return data as Playlist;
};

export const useDeletePlaylist = (userId: string) => {
	const deletePlaylistMutation = useMutation({
		mutationFn: (playlistId: number) => {
			console.log("deleting playlist");
			return deletePlaylistRequest(playlistId);
		},
		onMutate: async (playlistId) => {
			await queryClient.cancelQueries(["playlists", userId]);
			const oldState = queryClient.getQueryData([
				"playlists",
				userId,
			]) as PlaylistWithGames[];
			const newState = oldState.filter((playlist) => playlist.id !== playlistId);
			queryClient.setQueryData(["playlists", userId], newState);
		},

		onSuccess: () => {
			queryClient.invalidateQueries(["playlists", userId]);
		},
	});

	return deletePlaylistMutation;
};

/// ADD A GAME TO A SPECIFIC PLAYLIST
const postGameToPlaylist = async (playlistId: number, gameId: number) => {
	const body = [gameId];
	const res = await fetch(`/api/playlists/games?playlistId=${playlistId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		throw new Error("Network response was not ok");
	}

	const data = await res.json();
	return data as PlaylistsOnGames;
};

export const useAddGameToPlaylist = (userId: string) => {
	const addGameMutation = useMutation({
		mutationFn: ({ playlistId, gameId }: { playlistId: number; gameId: number }) => {
			queryClient.invalidateQueries(["playlists", playlistId, userId]);
			return postGameToPlaylist(playlistId, gameId);
		},

		onSuccess: (playlistOnGame) => {
			console.log(
				`game ${playlistOnGame.gameId} added to playlist ${playlistOnGame.playlistId}`
			);

			queryClient.invalidateQueries(["playlists", userId]);
		},
	});

	return addGameMutation;
};

/// ADD MANY GAMES TO A SPECIFIC PLAYLIST
const postBulkAddGamesToPlaylist = async (playlistId: number, gameIds: number[]) => {
	const res = await fetch(`/api/playlists/games?playlistId=${playlistId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(gameIds),
	});

	if (!res.ok) {
		throw new Error("Network response was not ok");
	}

	const data = await res.json();
	return data as PlaylistsOnGames;
};

export const useBulkAddGameToPlaylist = (userId: string) => {
	const bulkAddMutation = useMutation({
		mutationFn: ({
			playlistId,
			gameIds,
		}: {
			playlistId: number;
			gameIds: number[];
		}) => {
			queryClient.invalidateQueries(["playlists", playlistId, userId]);
			return postBulkAddGamesToPlaylist(playlistId, gameIds);
		},
		onMutate: (variables) => {
			console.log(`GAME IDS: ${variables.gameIds}`);
			console.log(`PLAYLIST ID: ${variables.playlistId}`);
		},

		onSuccess: (data) => {
			console.log(data);
		},
	});

	return bulkAddMutation;
};

/// DELETE A SPECIFIC GAME FROM A SPECIFIC PLAYLIST
const deleteGameFromPlaylist = async (playlistId: number, gameId: number) => {
	const body = { gameId: gameId };
	const res = await fetch(`/api/playlists/games?playlistId=${playlistId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		throw new Error("Network response was not ok");
	}

	const data = await res.json();
	return data as PlaylistsOnGames;
};

export const useDeleteGameFromPlaylist = (userId: string) => {
	const deleteGameMutation = useMutation({
		mutationFn: ({ playlistId, gameId }: { playlistId: number; gameId: number }) => {
			queryClient.invalidateQueries(["playlist", playlistId, userId]);

			return deleteGameFromPlaylist(playlistId, gameId);
		},

		onMutate: ({ playlistId, gameId }) => {
			const oldState = queryClient.getQueryData([
				"playlists",
				playlistId,
				userId,
			]) as GameWithCoverAndGenres[];
			const newState = oldState.filter((game) => game.gameId !== gameId);
			queryClient.cancelQueries(["playlists", playlistId, userId]);
			queryClient.setQueryData(["playlists", playlistId, userId], newState);
		},

		onSuccess: (playlistOnGame) => {
			console.log(
				`game ${playlistOnGame.gameId} deleted from playlist ${playlistOnGame.playlistId}`
			);

			queryClient.invalidateQueries(["playlists", userId]);
		},
	});

	return deleteGameMutation;
};

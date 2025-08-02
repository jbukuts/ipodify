import { QUERY_KEYS } from '#/lib/query-enum';
import { sdk } from '#/lib/sdk';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import useUserProfile from './use-user-profile';

export default function usePlaylistTracks(id: string) {
  const { data: playlist, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.playlist.GET, id],
    queryFn: () => sdk.playlists.getPlaylist(id, 'US')
  });

  const {
    data: playlistTracks,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.playlist.TRACKS, id],
    queryFn: ({ pageParam }) =>
      sdk.playlists.getPlaylistItems(id, 'US', undefined, 50, pageParam),
    initialPageParam: 100,
    getNextPageParam: (lastPage) =>
      lastPage.next ? lastPage.offset + 50 : undefined,
    enabled: playlist !== undefined && playlist.tracks.next !== null
  });

  const { data: profile } = useUserProfile();

  const allTracks = [
    ...(playlist ? playlist.tracks.items : []),
    ...(playlistTracks ? playlistTracks.pages.flatMap((p) => p.items) : [])
  ];

  const canModify =
    profile?.id === playlist?.owner.id || playlist?.collaborative;

  return {
    canModify,
    playlist,
    tracks: allTracks,
    isLoading,
    fetchNextPage,
    hasNextPage
  };
}

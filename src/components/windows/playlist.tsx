import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import BetterVirtualScreen from '../shared/better-virtual-screen';
import { sdk } from '#/lib/sdk';
import TrackItem from '../shared/track-item';
import usePlaySong from '#/hooks/usePlaySong';
import type { Track } from '@spotify/web-api-ts-sdk';
import MenuItem from '../shared/menu-item';
import { QUERY_KEYS } from '#/lib/query-enum';

function usePlaylistTracks(id: string) {
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

  const { data: profile } = useQuery({
    queryKey: [QUERY_KEYS.user.PROFILE],
    queryFn: () => sdk.currentUser.profile()
  });

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

export default function Playlist(props: { id: string }) {
  const { id } = props;

  const playSong = usePlaySong();
  const { tracks, playlist, isLoading, hasNextPage, fetchNextPage, canModify } =
    usePlaylistTracks(id);

  const handleClick = (track: Track) => {
    if (!playlist || tracks.length === 0) return;
    playSong({
      track,
      contextUri: playlist.uri,
      offset: track.linked_from ? track.linked_from.uri : track.uri
    });
  };

  return (
    <BetterVirtualScreen
      hasNextPage={hasNextPage}
      loading={isLoading}
      loaded={tracks.length}
      fetchNextPage={fetchNextPage}>
      {({ index, style }) => {
        const { track } = tracks[index];

        if (track === null)
          return (
            <MenuItem style={style} disabled icon={false}>
              {index + 1}.
            </MenuItem>
          );

        return (
          <TrackItem
            playlistId={canModify ? id : undefined}
            track={track}
            trackNumber={index + 1}
            style={style}
            onClick={() => handleClick(track)}
          />
        );
      }}
    </BetterVirtualScreen>
  );
}

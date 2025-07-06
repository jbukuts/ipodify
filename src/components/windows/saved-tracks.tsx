import { sdk } from '#/lib/sdk';
import type { Track } from '@spotify/web-api-ts-sdk';
import { useInfiniteQuery } from '@tanstack/react-query';
import BetterVirtualScreen from '../shared/better-virtual-screen';
import TrackItem from '../shared/track-item';
import usePlaySong from '#/hooks/usePlaySong';
import { useCallback, useMemo } from 'react';

function useSavedTracks() {
  const { data, ...rest } = useInfiniteQuery({
    queryKey: ['liked_songs'],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      sdk.currentUser.tracks.savedTracks(50, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.next ? lastPage.offset + 50 : undefined
  });

  const flatTracks = useMemo(
    () => (data ? data.pages.flatMap((d) => d.items) : []),
    [data]
  );

  return { tracks: flatTracks, ...rest };
}

export default function SavedTracks() {
  const playSong = usePlaySong();

  const { tracks, hasNextPage, isLoading, fetchNextPage } = useSavedTracks();

  const handlePlaySong = useCallback(
    (track: Track, idx: number) => {
      const range = tracks
        .slice(Math.max(idx - 10, 0), idx + 10)
        .map((t) => t.track.uri);
      const offset = range.findIndex((s) => track.uri === s);

      playSong({
        uris: range,
        offset
      });
    },
    [tracks, playSong]
  );

  return (
    <BetterVirtualScreen
      hasNextPage={hasNextPage}
      loading={isLoading}
      loaded={tracks.length}
      fetchNextPage={fetchNextPage}>
      {({ index, style }) => (
        <TrackItem
          isLiked={true}
          onClick={() => handlePlaySong(tracks[index].track, index)}
          track={tracks[index].track}
          trackNumber={index + 1}
          style={style}
        />
      )}
    </BetterVirtualScreen>
  );
}

import { sdk } from '#/lib/sdk';
import { useQuery } from '@tanstack/react-query';
import Screen from '../shared/screen';
import { QUERY_KEYS } from '#/lib/query-enum';
import usePlaySong from '#/hooks/player/use-play-song';
import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { TrackItem as TrackItemType } from '@spotify/web-api-ts-sdk';
import TrackItem from '../shared/track-item';
import { useGlobalPlaybackState } from '#/lib/playback-state-context/hooks';

export default function Queue() {
  const playSong = usePlaySong();
  const contextUri = useGlobalPlaybackState(useShallow((s) => s.context?.uri));

  const { data, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.player.QUEUE],
    initialData: { queue: [], currently_playing: null },
    queryFn: () => sdk.player.getUsersQueue()
  });

  const queueTracks = useMemo(
    () => [
      ...(data.currently_playing ? [data.currently_playing] : []),
      ...data.queue
    ],
    [data]
  );

  const handleClick = useCallback(
    (track: TrackItemType, idx: number) => {
      if (contextUri)
        return playSong({
          contextUri,
          offset: track.uri
        });

      const range = queueTracks
        .slice(Math.max(idx - 5, 0), Math.min(idx + 5, queueTracks.length - 1))
        .map((t) => t.uri);
      const offset = range.findIndex((s) => track.uri === s);

      playSong({
        uris: range,
        offset
      });
    },
    [playSong, contextUri, queueTracks]
  );

  return (
    <Screen loading={isFetching && data.currently_playing === null}>
      {queueTracks.map((track, idx) => (
        <TrackItem
          key={idx}
          trackNumber={idx + 1}
          track={track}
          onClick={() => handleClick(track, idx)}
        />
      ))}
    </Screen>
  );
}

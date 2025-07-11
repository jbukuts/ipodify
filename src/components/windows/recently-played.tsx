import { sdk } from '#/lib/sdk';
import type { Track } from '@spotify/web-api-ts-sdk';
import { useQuery } from '@tanstack/react-query';
import Screen from '../shared/screen';
import TrackItem from '../shared/track-item';
import usePlaySong from '#/hooks/usePlaySong';
import { useMemo } from 'react';
import { QUERY_KEYS } from '#/lib/query-enum';

interface UseRecentlyPlayedOpts {
  timestamp?: number;
  duplicates?: boolean;
}

function useRecentlyPlayed(opts?: UseRecentlyPlayedOpts) {
  const { timestamp = Date.now(), duplicates = false } = opts ?? {};

  const { data, ...rest } = useQuery({
    queryKey: [QUERY_KEYS.player.RECENTLY_PLAYED],
    queryFn: () =>
      sdk.player.getRecentlyPlayedTracks(50, {
        type: 'before',
        timestamp
      }),
    select: (d) => d.items
  });

  const tracks = useMemo(() => {
    const tmp = data ? data : [];
    if (duplicates || tmp.length === 0) return tmp;

    const res = [tmp[0]];
    for (let i = 1; i < tmp.length; i++) {
      if (tmp[i].track.id !== tmp[i - 1].track.id) res.push(tmp[i]);
    }

    return res;
  }, [data, duplicates]);

  return { tracks, ...rest };
}

export default function RecentlyPlayed() {
  const playSong = usePlaySong();
  const { tracks, isLoading } = useRecentlyPlayed({ duplicates: false });

  const handlePlaySong = (track: Track, idx: number) => {
    const range = tracks
      .slice(Math.max(idx - 5, 0), Math.min(idx + 5, tracks.length - 1))
      .map((t) => t.track.uri);
    const offset = range.findIndex((s) => track.uri === s);

    playSong({
      uris: range,
      offset
    });
  };

  return (
    <Screen loading={isLoading}>
      {tracks.map(({ track }, idx) => (
        <TrackItem
          trackNumber={idx + 1}
          track={track}
          key={idx}
          onClick={() => handlePlaySong(track, idx)}
        />
      ))}
    </Screen>
  );
}

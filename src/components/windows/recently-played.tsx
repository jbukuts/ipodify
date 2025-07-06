import { sdk } from '#/lib/auth';
import type { Track } from '@spotify/web-api-ts-sdk';
import { useQuery } from '@tanstack/react-query';
import Screen from '../shared/screen';
import TrackItem from '../shared/track-item';
import usePlaySong from '#/hooks/usePlaySong';

export default function RecentlyPlayed() {
  const playSong = usePlaySong();

  const { data, isLoading } = useQuery({
    queryKey: ['recently_played'],
    queryFn: () =>
      sdk.player.getRecentlyPlayedTracks(50, {
        type: 'before',
        timestamp: Date.now()
      })
  });
  const allRows = data ? data.items : [];

  const handlePlaySong = (track: Track, idx: number) => {
    const range = allRows
      .slice(Math.max(idx - 5, 0), idx + 5)
      .map((t) => t.track.uri);
    const offset = range.findIndex((s) => track.uri === s);

    playSong({
      uris: range,
      offset
    });
  };

  return (
    <Screen loading={isLoading}>
      {allRows.map(({ track }, idx) => (
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

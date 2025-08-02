import type { Track } from '@spotify/web-api-ts-sdk';
import Screen from '../shared/screen';
import TrackItem from '../shared/track-item';
import usePlaySong from '#/hooks/player/use-play-song';
import { useRecentlyPlayed } from '#/hooks/player/use-recently-played';

export default function RecentlyPlayed() {
  const playSong = usePlaySong();
  const { tracks, isLoading } = useRecentlyPlayed({ duplicates: false });

  const handlePlaySong = (track: Track, idx: number) => {
    const range = tracks
      .slice(Math.max(idx - 5, 0), Math.min(idx + 5, tracks.length - 1))
      .map((t) => t.track.uri);
    const offset = range.findIndex((s) => track.uri === s);

    playSong({
      track,
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

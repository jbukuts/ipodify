import type { Track } from '@spotify/web-api-ts-sdk';
import BetterVirtualScreen from '../shared/better-virtual-screen';
import TrackItem from '../shared/track-item';
import usePlaySong from '#/hooks/usePlaySong';
import { memo, useCallback } from 'react';
import useSavedTracks from '#/hooks/player/use-saved-tracks';

function InternalSavedTracks() {
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
      {({ index, style }) => {
        const { track } = tracks[index];
        return (
          <TrackItem
            isLiked={true}
            onClick={() => handlePlaySong(track, index)}
            track={track}
            trackNumber={index + 1}
            style={style}
          />
        );
      }}
    </BetterVirtualScreen>
  );
}

const SavedTracks = memo(InternalSavedTracks);
export default SavedTracks;

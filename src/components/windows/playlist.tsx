import BetterVirtualScreen from '../shared/better-virtual-screen';
import TrackItem from '../shared/track-item';
import usePlaySong from '#/hooks/player/use-play-song';
import type { Track } from '@spotify/web-api-ts-sdk';
import MenuItem from '../shared/menu-item';
import usePlaylistTracks from '#/hooks/player/use-playlist-tracks';

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

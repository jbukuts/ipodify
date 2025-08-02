import type { SimplifiedTrack } from '@spotify/web-api-ts-sdk';
import { memo } from 'react';
import MenuItem from '../shared/menu-item';
import { Disc3 } from 'lucide-react';
import TrackItem from '../shared/track-item';
import usePlaySong from '#/hooks/player/use-play-song';
import BetterVirtualScreen from '../shared/better-virtual-screen';
import useAlbumTracks from '#/hooks/player/use-album-tracks';

/**
 * Album screen
 */
export default memo(function Album(props: { id: string }) {
  const { id } = props;

  const playSong = usePlaySong();
  const { tracks, isLoading, albumData, hasNextPage, fetchNextPage } =
    useAlbumTracks(id);

  const handlePlaySong = (track: SimplifiedTrack) => {
    const { linked_from, uri } = track;
    if (!albumData) return;

    playSong({
      track: {
        ...track,
        album: { ...albumData, album_group: '' },
        external_ids: { upc: '', ean: '', isrc: '' },
        popularity: 0
      },
      contextUri: albumData.uri,
      offset: linked_from ? linked_from.uri : uri
    });
  };

  return (
    <BetterVirtualScreen
      loaded={tracks.length}
      loading={isLoading}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}>
      {({ index, style }) => {
        const track = tracks[index];

        if (typeof track === 'number')
          return (
            <MenuItem
              style={style}
              className='pointer-events-none justify-start gap-2'
              icon={Disc3}>
              Disc {track + 1}
            </MenuItem>
          );

        return (
          <TrackItem
            track={{
              ...track,
              ...(albumData ? { album: { ...albumData, album_group: '' } } : {})
            }}
            style={style}
            onClick={() => handlePlaySong(track)}
            showGoToAlbum={false}
          />
        );
      }}
    </BetterVirtualScreen>
  );
});

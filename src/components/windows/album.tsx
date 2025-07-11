import { sdk } from '#/lib/sdk';
import type { Market, SimplifiedTrack } from '@spotify/web-api-ts-sdk';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { memo, useMemo } from 'react';
import MenuItem from '../shared/menu-item';
import { Disc3 } from 'lucide-react';
import TrackItem from '../shared/track-item';
import usePlaySong from '#/hooks/usePlaySong';
import BetterVirtualScreen from '../shared/better-virtual-screen';
import { QUERY_KEYS } from '#/lib/query-enum';

/**
 * Get album metadata and tracks for a given album
 */
function useAlbumTracks(id: string, market: Market = 'US') {
  const { data: albumData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.album.GET, id],
    queryFn: () => sdk.albums.get(id, market)
  });

  const {
    data: restTracks = [],
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.album.TRACKS, id],
    initialPageParam: 50,
    queryFn: ({ pageParam }) => sdk.albums.tracks(id, 'US', 50, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.next ? lastPage.offset + 50 : undefined,
    enabled: albumData !== undefined && albumData.tracks.next !== null,
    select: (d) => d.pages.flatMap((p) => p.items)
  });

  const groupTracks = useMemo(() => {
    const allTracks = [
      ...(albumData ? albumData.tracks.items : []),
      ...restTracks
    ];
    return allTracks.reduce((acc, curr) => {
      const { disc_number = 1 } = curr;
      if (!acc[disc_number - 1]) acc.push([]);
      acc[disc_number - 1].push(curr);
      return acc;
    }, [] as SimplifiedTrack[][]);
  }, [albumData, restTracks]);

  const flatTracks = groupTracks.flatMap((disc, index, arr) => {
    if (arr.length === 1) return disc;
    return [index, ...disc];
  });

  return {
    tracks: flatTracks,
    isLoading,
    albumData,
    fetchNextPage,
    hasNextPage
  };
}

/**
 * Album screen
 */
function InternalAlbum(props: { id: string }) {
  const { id } = props;

  const playSong = usePlaySong();
  const { tracks, isLoading, albumData, hasNextPage, fetchNextPage } =
    useAlbumTracks(id);

  const handlePlaySong = (track: SimplifiedTrack) => {
    const { linked_from, uri } = track;

    if (!albumData) return;
    playSong({
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
}

const Album = memo(InternalAlbum);
export default Album;

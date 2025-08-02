import { QUERY_KEYS } from '#/lib/query-enum';
import { sdk } from '#/lib/sdk';
import type { Market, SimplifiedTrack } from '@spotify/web-api-ts-sdk';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const ALBUM_STALE_TIME = Infinity;

/**
 * Get album metadata and tracks for a given album
 */
export default function useAlbumTracks(id: string, market: Market = 'US') {
  const { data: albumData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.album.GET, id],
    queryFn: () => sdk.albums.get(id, market),
    staleTime: ALBUM_STALE_TIME
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
    select: (d) => d.pages.flatMap((p) => p.items),
    staleTime: ALBUM_STALE_TIME
  });

  const flatTracks = useMemo(() => {
    const allTracks = [
      ...(albumData ? albumData.tracks.items : []),
      ...restTracks
    ];

    const grouped = allTracks.reduce((acc, curr) => {
      const { disc_number = 1 } = curr;
      if (!acc[disc_number - 1]) acc.push([]);
      acc[disc_number - 1].push(curr);
      return acc;
    }, [] as SimplifiedTrack[][]);

    return grouped.flatMap((disc, index, arr) => {
      if (arr.length === 1) return disc;
      return [index, ...disc];
    });
  }, [albumData, restTracks]);

  return {
    tracks: flatTracks,
    isLoading,
    albumData,
    fetchNextPage,
    hasNextPage
  };
}

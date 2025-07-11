import { QUERY_KEYS } from '#/lib/query-enum';
import { sdk } from '#/lib/sdk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export default function useSavedTracks() {
  const { data, ...rest } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.track.SAVED_LIST],
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

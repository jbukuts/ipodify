import { QUERY_KEYS } from '#/lib/query-enum';
import { sdk } from '#/lib/sdk';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function useSavedTracks() {
  const {
    data = [],
    hasNextPage,
    isLoading,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.track.SAVED_LIST],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      sdk.currentUser.tracks.savedTracks(50, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.next ? lastPage.offset + 50 : undefined,
    select: ({ pages }) => pages.flatMap((p) => p.items)
  });

  return { tracks: data, hasNextPage, isLoading, fetchNextPage };
}

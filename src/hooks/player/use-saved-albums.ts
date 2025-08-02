import { QUERY_KEYS } from '#/lib/query-enum';
import { sdk } from '#/lib/sdk';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function useSavedAlbums() {
  const {
    data = [],
    fetchNextPage,
    isLoading,
    hasNextPage
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.album.SAVED_LIST],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      sdk.currentUser.albums.savedAlbums(50, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.next ? lastPage.offset + 50 : undefined,
    select: (d) => d.pages.flatMap((d) => d.items)
  });

  return { albums: data, fetchNextPage, isLoading, hasNextPage };
}

import { QUERY_KEYS } from '#/lib/query-enum';
import { sdk } from '#/lib/sdk';
import type { Artist, Page } from '@spotify/web-api-ts-sdk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UpdatedPage<T> extends Page<T> {
  cursors: { after?: string; before?: string };
}

type UpdatedFollowedArtist = Promise<{ artists: UpdatedPage<Artist> }>;

export default function useSavedArtists() {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.artist.SAVED_LIST],
    initialPageParam: '',
    queryFn: ({ pageParam }) => {
      return sdk.currentUser.followedArtists(
        pageParam,
        50
      ) as UpdatedFollowedArtist;
    },
    getNextPageParam: (lastPage) =>
      lastPage.artists.cursors.after
        ? lastPage.artists.cursors.after
        : undefined
  });

  const allRows = useMemo(
    () => (data ? data.pages.flatMap((d) => d.artists.items) : []),
    [data]
  );

  return {
    artists: allRows,
    isLoading,
    fetchNextPage,
    hasNextPage
  };
}

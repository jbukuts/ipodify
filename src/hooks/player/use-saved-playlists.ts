import { QUERY_KEYS } from '#/lib/query-enum';
import { sdk } from '#/lib/sdk';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UsePlaylistsOpts {
  enabled?: boolean;
  ownerOnly?: boolean;
}

export default function useSavedPlaylists(opts: UsePlaylistsOpts) {
  const { enabled = false, ownerOnly = false } = opts;

  const { data: profile } = useQuery({
    queryKey: [QUERY_KEYS.user.PROFILE, 'me'],
    queryFn: () => sdk.currentUser.profile(),
    staleTime: Infinity,
    enabled: ownerOnly
  });

  const { data: playlists, isLoading } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.playlist.SAVED_LIST],
    queryFn: async ({ pageParam }) => {
      return sdk.currentUser.playlists.playlists(50, pageParam);
    },
    getNextPageParam: (lastPage) =>
      lastPage.next ? lastPage.offset + 50 : undefined,
    initialPageParam: 0,
    enabled: enabled && (!ownerOnly || profile !== undefined)
  });

  const flatPlaylists = useMemo(
    () =>
      !ownerOnly
        ? (playlists?.pages.flatMap((p) => p.items) ?? [])
        : (playlists?.pages.flatMap((p) => p.items) ?? []).filter(
            (p) => p.owner.id === profile?.id || p.collaborative
          ),
    [playlists, profile, ownerOnly]
  );

  return {
    playlists: flatPlaylists,
    isLoading
  };
}

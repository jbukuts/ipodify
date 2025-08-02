import { QUERY_KEYS } from '#/lib/query-enum';
import { sdk } from '#/lib/sdk';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UseRecentlyPlayedOpts {
  timestamp?: number;
  duplicates?: boolean;
}

export function useRecentlyPlayed(opts?: UseRecentlyPlayedOpts) {
  const { timestamp = Date.now(), duplicates = false } = opts ?? {};

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.player.RECENTLY_PLAYED],
    queryFn: () =>
      sdk.player.getRecentlyPlayedTracks(50, {
        type: 'before',
        timestamp
      }),
    select: (d) => d.items
  });

  const tracks = useMemo(() => {
    const tmp = data ? data : [];
    if (duplicates || tmp.length === 0) return tmp;

    const res = [tmp[0]];
    for (let i = 1; i < tmp.length; i++) {
      if (tmp[i].track.id !== tmp[i - 1].track.id) res.push(tmp[i]);
    }

    return res;
  }, [data, duplicates]);

  return { tracks, isLoading };
}

import { useInfiniteQuery } from '@tanstack/react-query';
import BetterVirtualScreen from '../shared/better-virtual-screen';
import { sdk } from '#/lib/sdk';
import { useEffect, useMemo, type ComponentProps } from 'react';
import type { Artist, Page } from '@spotify/web-api-ts-sdk';
import MenuItem from '../shared/menu-item';
import useAddWindow from '#/hooks/useAddWindow';
import { QUERY_KEYS } from '#/lib/query-enum';

interface UpdatedPage<T> extends Page<T> {
  cursors: { after?: string; before?: string };
}

type T = Promise<{ artists: UpdatedPage<Artist> }>;

function ArtistItem(
  props: { artist: Artist } & Omit<ComponentProps<typeof MenuItem>, 'onClick'>
) {
  const { artist, ...rest } = props;
  const { name, id } = artist;

  const addWindow = useAddWindow();

  return (
    <MenuItem
      {...rest}
      text={undefined}
      onClick={addWindow(name, 'Artist', { id })}>
      {name}
    </MenuItem>
  );
}

export default function SavedArtists() {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.artist.SAVED_LIST],
    initialPageParam: '',
    queryFn: ({ pageParam }) => {
      return sdk.currentUser.followedArtists(pageParam, 50) as T;
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

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <BetterVirtualScreen
      hasNextPage={hasNextPage}
      loading={isLoading}
      loaded={allRows.length}
      fetchNextPage={fetchNextPage}>
      {({ index, style }) => {
        return <ArtistItem style={style} artist={allRows[index]} />;
      }}
    </BetterVirtualScreen>
  );
}

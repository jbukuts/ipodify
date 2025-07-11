import { useInfiniteQuery } from '@tanstack/react-query';
import { sdk } from '#/lib/sdk';
import BetterVirtualScreen from '../shared/better-virtual-screen';
import AlbumItem from '../shared/album-item';
import { QUERY_KEYS } from '#/lib/query-enum';

export default function SavedAlbums() {
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

  return (
    <BetterVirtualScreen
      loaded={data.length}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loading={isLoading}>
      {({ index, style }) => {
        const { album } = data[index];
        return <AlbumItem album={album} style={style} />;
      }}
    </BetterVirtualScreen>
  );
}

import BetterVirtualScreen from '../shared/better-virtual-screen';
import AlbumItem from '../shared/album-item';
import { memo } from 'react';
import useSavedAlbums from '#/hooks/player/use-saved-albums';

export default memo(function SavedAlbums() {
  const {
    albums = [],
    fetchNextPage,
    isLoading,
    hasNextPage
  } = useSavedAlbums();

  return (
    <BetterVirtualScreen
      loaded={albums.length}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loading={isLoading}>
      {({ index, style }) => {
        const { album } = albums[index];
        return <AlbumItem album={album} style={style} />;
      }}
    </BetterVirtualScreen>
  );
});

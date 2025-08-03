import BetterVirtualScreen from '../shared/better-virtual-screen';
import ArtistItem from '../shared/artist-item';
import useSavedArtists from '#/hooks/player/use-saved-artists';

export default function SavedArtists() {
  const { artists, isLoading, fetchNextPage, hasNextPage } = useSavedArtists();

  return (
    <BetterVirtualScreen
      hasNextPage={hasNextPage}
      loading={isLoading}
      loaded={artists.length}
      fetchNextPage={fetchNextPage}>
      {({ index, style }) => {
        return <ArtistItem style={style} artist={artists[index]} />;
      }}
    </BetterVirtualScreen>
  );
}

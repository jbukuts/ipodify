import MenuItem from '../shared/menu-item';
import Screen from '../shared/screen';
import useAddWindow from '#/hooks/use-add-window';

export default function Library() {
  const goTo = useAddWindow();

  return (
    <Screen>
      <MenuItem onClick={goTo('Recently Played', 'Recents')}>
        Recently Played
      </MenuItem>
      <MenuItem onClick={goTo('Liked Songs', 'SavedTracks')}>Songs</MenuItem>
      <MenuItem onClick={goTo('Albums', 'SavedAlbums')}>Albums</MenuItem>
      <MenuItem onClick={goTo('Followed Artists', 'SavedArtists')}>
        Artists
      </MenuItem>
      <MenuItem onClick={goTo('Playlists', 'SavedPlaylists')}>
        Playlists
      </MenuItem>
      <MenuItem onClick={goTo('Search', 'Search')}>Search</MenuItem>
    </Screen>
  );
}

import MenuItem from '../shared/menu-item';
import Screen from '../shared/screen';
import useWindowStore from '#/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { useCallback } from 'react';

export default function Library() {
  const addWindow = useWindowStore(useShallow((s) => s.addWindow));

  const goTo = useCallback(
    (...opts: Parameters<typeof addWindow>) => {
      return () => addWindow(...opts);
    },
    [addWindow]
  );

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
    </Screen>
  );
}

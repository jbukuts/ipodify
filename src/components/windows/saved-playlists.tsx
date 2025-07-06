import Screen from '../shared/screen';
import MenuItem from '../shared/menu-item';
import { useShallow } from 'zustand/react/shallow';
import usePlaybackState from '#/lib/store/now-playing';
import { ChevronRight, Volume } from 'lucide-react';
import useAddWindow from '#/hooks/useAddWindow';
import useSavedPlaylists from '#/hooks/player/use-saved-playlists';

export default function PlayLists() {
  const goTo = useAddWindow();
  const contextUri = usePlaybackState(useShallow((s) => s.context?.uri));
  const { playlists } = useSavedPlaylists({ enabled: true });

  return (
    <Screen>
      {playlists.map((playlist) => (
        <MenuItem
          key={playlist.id}
          onClick={goTo(playlist.name, 'Playlist', { id: playlist.id })}
          icon={
            contextUri === playlist.uri ? [Volume, ChevronRight] : undefined
          }>
          {playlist.name}
        </MenuItem>
      ))}
    </Screen>
  );
}

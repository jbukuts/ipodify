import Screen from '../shared/screen';
import MenuItem from '../shared/menu-item';
import { useShallow } from 'zustand/react/shallow';
import { ChevronRight, Volume } from 'lucide-react';
import useAddWindow from '#/hooks/use-add-window';
import useSavedPlaylists from '#/hooks/player/use-saved-playlists';
import { useGlobalPlaybackState } from '#/lib/playback-state-context/hooks';

export default function PlayLists() {
  const goTo = useAddWindow();
  const contextUri = useGlobalPlaybackState(useShallow((s) => s.context?.uri));
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

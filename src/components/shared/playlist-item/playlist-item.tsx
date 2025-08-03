import useAddWindow from '#/hooks/use-add-window';
import type { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';
import MenuItem from '../menu-item';
import { useShallow } from 'zustand/react/shallow';
import { useGlobalPlaybackState } from '#/lib/playback-state-context/hooks';
import { ChevronRight, Volume } from 'lucide-react';

interface PlaylistItemProps {
  playlist: Pick<SimplifiedPlaylist, 'uri' | 'id' | 'name'>;
}

export default function PlaylistItem(props: PlaylistItemProps) {
  const { playlist } = props;

  const goTo = useAddWindow();
  const contextUri = useGlobalPlaybackState(useShallow((s) => s.context?.uri));

  return (
    <MenuItem
      onClick={goTo(playlist.name, 'Playlist', { id: playlist.id })}
      icon={contextUri === playlist.uri ? [Volume, ChevronRight] : undefined}>
      {playlist.name}
    </MenuItem>
  );
}

import useAddWindow from '#/hooks/useAddWindow';
import { useShallow } from 'zustand/react/shallow';
import MenuItem from '../shared/menu-item';
import Screen from '../shared/screen';
import { useGlobalPlaybackState } from '#/lib/playback-state-context/hooks';

export default function MainMenu() {
  const goTo = useAddWindow();
  const isNull = useGlobalPlaybackState(useShallow((s) => s.item === null));

  return (
    <Screen>
      <MenuItem onClick={goTo('Library', 'Library')}>Library</MenuItem>
      <MenuItem onClick={goTo('Settings', 'Settings')}>Settings</MenuItem>
      <MenuItem onClick={goTo('Queue', 'Queue')}>Queue</MenuItem>
      <MenuItem disabled={isNull} onClick={goTo('Now Playing', 'NowPlaying')}>
        Now Playing
      </MenuItem>
    </Screen>
  );
}

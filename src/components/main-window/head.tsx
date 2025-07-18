import { useTogglePlayback } from '#/hooks/useTogglePlayback';
import useWindowTitle from '#/hooks/useWindowTitle';
import usePlaybackStateStore from '#/lib/store/playback-state-store';
import useWindowStore from '#/lib/store/window-store';
import { useShallow } from 'zustand/react/shallow';
import IconButton from '../shared/icon-button';
import { Pause, Play } from 'lucide-react';
import MenuItem from '../shared/menu-item';
import { cn } from '#/lib/utils';
import VolumeControl from './volume-control';

export function Head() {
  const { removeWindow, windowTitles } = useWindowStore(
    useShallow(({ removeWindow, windowTitles }) => ({
      removeWindow,
      windowTitles
    }))
  );

  const { device } = usePlaybackStateStore(
    useShallow(({ device }) => ({
      device
    }))
  );
  const title = useWindowTitle();
  const { toggle, isPlaying } = useTogglePlayback();

  const goBack = () => removeWindow();

  return (
    <div className='flex w-full justify-between gap-1 border-b-[0.125rem] border-fg pb-1'>
      <IconButton
        disabled={device === null}
        icon={!isPlaying ? Play : Pause}
        onClick={() => toggle()}></IconButton>
      <MenuItem
        onClick={goBack}
        className={cn(
          'justify-center truncate px-1',
          windowTitles.length <= 1 && 'pointer-events-none'
        )}
        icon={false}>
        {title}
      </MenuItem>
      <VolumeControl />
    </div>
  );
}

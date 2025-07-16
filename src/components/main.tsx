import {
  createElement,
  Suspense,
  useEffect,
  useState,
  type ComponentProps
} from 'react';
import useWindowStore from '#/lib/store/window-store';
import { cn } from '#/lib/utils';
import MenuItem from './shared/menu-item';
import {
  Fullscreen,
  Minimize,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume1,
  type LucideIcon
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useTogglePlayback } from '#/hooks/useTogglePlayback';
import useWindowTitle from '#/hooks/useWindowTitle';
import IconButton from './shared/icon-button';
import Blobs from './blobs';
import SCREEN_MAP from './windows';
import useAddWindow from '#/hooks/useAddWindow';
import usePlaybackStateStore from '#/lib/store/playback-state-store';
import { PlaybackSDKProvider } from '#/lib/playback-sdk-context';
import Screen from './shared/screen';
import { useMutation } from '@tanstack/react-query';
import { sdk } from '#/lib/sdk';

function AlbumArt() {
  const goTo = useAddWindow();
  const { images } = usePlaybackStateStore(
    useShallow(({ item }) => ({
      images: item && 'album' in item ? item.album.images : null
    }))
  );

  return (
    <>
      {images && images.length > 0 && (
        <img
          onClick={goTo('Now Playing', 'NowPlaying')}
          className='fixed top-[calc(50%-6rem)] left-[50%] z-0 size-50 translate-[-50%] rounded-md transition-[top] hover:top-[calc(50%-12rem)] hover:cursor-pointer'
          src={images[0].url}
        />
      )}
    </>
  );
}

function Head() {
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
      <IconButton icon={Volume1} />
    </div>
  );
}

function Controls() {
  const { isPlaying, toggle } = useTogglePlayback();

  const { mutate: skip } = useMutation({
    mutationFn: async (dir: 'prev' | 'next') => {
      const fn = dir === 'prev' ? 'skipToPrevious' : 'skipToNext';
      await sdk.player[fn]('');
    }
  });

  const ControlButton = (props: {
    icon: LucideIcon;
    size?: number;
    className?: string;
    onClick?: ComponentProps<'button'>['onClick'];
  }) => {
    const { icon, className, size = 24, onClick } = props;

    return (
      <button
        className={cn(
          'group relative rounded-full border-[0.0625rem] border-fg bg-bg/100 p-2 backdrop-blur-xs hover:cursor-pointer',
          className
        )}
        onClick={onClick}>
        {createElement(icon, {
          size,
          className:
            'fill-fg/75 text-fg/75 transition-["fill"] group-hover:fill-fg',
          style: { filter: 'drop-shadow( 0px 0px 0px var(--color-fg))' }
        })}
      </button>
    );
  };

  return (
    <div className='fixed top-[calc(50%+12rem)] left-[50%] z-0 flex translate-[-50%] flex-row items-center gap-2'>
      <ControlButton icon={SkipBack} onClick={() => skip('prev')} />

      <ControlButton
        icon={isPlaying ? Pause : Play}
        size={32}
        className='p-3'
        onClick={toggle}
      />
      <ControlButton icon={SkipForward} onClick={() => skip('next')} />
    </div>
  );
}

function FullscreenButton() {
  const [fullscreen, setFullScreen] = useState(false);

  useEffect(() => {
    const onFullScreenChange = () => {
      setFullScreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', onFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullScreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <button
      type='button'
      title='toggle fullscreen'
      className='fixed right-1 bottom-1 hover:cursor-pointer'
      onClick={toggleFullscreen}>
      {fullscreen ? <Minimize /> : <Fullscreen />}
    </button>
  );
}

function NoDeviceButton() {
  const goTo = useAddWindow();
  const { device } = usePlaybackStateStore(
    useShallow(({ device, startPolling, stopPolling }) => ({
      device,
      startPolling,
      stopPolling
    }))
  );

  const windows = useWindowStore(useShallow(({ windows }) => windows));

  return (
    device === null &&
    windows[windows.length - 1][0] !== 'Devices' && (
      <button
        className='fixed bottom-[calc(50%-13.5rem)] left-1/2 translate-[-50%] rounded-md border-[0.125rem] border-black px-2.5 py-1 font-mono text-xs font-semibold text-black hover:cursor-pointer'
        type='button'
        onClick={goTo('Devices', 'Devices')}>
        Select a device
      </button>
    )
  );
}

export default function Main() {
  const { startPolling, stopPolling } = usePlaybackStateStore(
    useShallow(({ startPolling, stopPolling }) => ({
      startPolling,
      stopPolling
    }))
  );
  const { windows, windowsLength } = useWindowStore(
    useShallow(({ windows, windowTitles }) => ({
      windows,
      windowsLength: windowTitles.length
    }))
  );

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return (
    <PlaybackSDKProvider>
      <Blobs />
      <AlbumArt />
      <NoDeviceButton />
      <FullscreenButton />
      <Controls />
      <main className='custom-scroll relative flex h-[18.75rem] w-[25rem] flex-col border-[0.125rem] border-fg bg-bg p-3'>
        <Head />
        <div
          className={cn('flex w-full grow overflow-hidden')}
          id='view-area'
          tabIndex={-1}>
          <div
            tabIndex={-1}
            style={{
              transform: `translateX(${-1 * (windowsLength - 1) * 100}%)`
            }}
            className='flex w-auto min-w-full transition-transform'>
            {windows.map((w, idx) => {
              const [comp, props, id] = w;
              const isActiveWindow = idx !== windowsLength - 1;

              const Comp = SCREEN_MAP[comp];

              return (
                <div
                  key={id}
                  className={cn(
                    'size-full shrink-0',
                    isActiveWindow && 'select-none'
                  )}
                  inert={isActiveWindow}
                  data-window={idx}>
                  <Suspense fallback={<Screen loading />}>
                    <Comp {...props}></Comp>
                  </Suspense>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </PlaybackSDKProvider>
  );
}

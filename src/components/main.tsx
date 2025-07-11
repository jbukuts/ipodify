import { Suspense, useEffect } from 'react';
import useWindowStore from '#/lib/store';
import { cn } from '#/lib/utils';
import MenuItem from './shared/menu-item';
import { Pause, Play, Volume1 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import useNowPlaying from '#/lib/store/now-playing';
import { useTogglePlayback } from '#/hooks/useTogglePlayback';
import useWindowTitle from '#/hooks/useWindowTitle';
import usePalette from '#/hooks/usePalette';
import IconButton from './shared/icon-button';
import Blobs from './blobs';
import SCREEN_MAP from './windows';
import useAddWindow from '#/hooks/useAddWindow';
import usePlaybackState from '#/lib/store/now-playing';
import { PlaybackSDKProvider } from '#/lib/playback-sdk-context';
import Screen from './shared/screen';

function calcOverlayColor(color: [number, number, number]) {
  const [r, g, b] = color;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? 'black' : 'white';
}

function AlbumArt() {
  const goTo = useAddWindow();
  const { images } = useNowPlaying(
    useShallow(({ item }) => ({
      images: item && 'album' in item ? item.album.images : null,
      album: item && 'album' in item ? item.album : null
    }))
  );

  const palette = usePalette(
    images ? images[images.length - 1].url : undefined
  );

  useEffect(() => {
    if (palette.length < 1) return;
    const c = palette[0];
    document.body.style.backgroundColor = `rgb(${c.join(',')})`;

    const credit = document.getElementById('credit');
    if (!credit) return;
    credit.style.color = calcOverlayColor(c);
  }, [palette]);

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

  const { device } = useNowPlaying(
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

export default function Main() {
  const goTo = useAddWindow();
  const { device, startPolling, stopPolling } = usePlaybackState(
    useShallow(({ device, startPolling, stopPolling }) => ({
      device,
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
      {device === null && windows[windows.length - 1][0] !== 'Devices' && (
        <button
          className='fixed bottom-[calc(50%-13.5rem)] left-1/2 translate-[-50%] rounded-md border-[0.125rem] border-black px-2.5 py-1 font-mono text-xs font-semibold text-black hover:cursor-pointer'
          type='button'
          onClick={goTo('Devices', 'Devices')}>
          Select a device
        </button>
      )}
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

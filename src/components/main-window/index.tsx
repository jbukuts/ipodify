import { Suspense, useEffect } from 'react';
import useWindowStore from '#/lib/store/window-store';
import { cn } from '#/lib/utils';
import { useShallow } from 'zustand/react/shallow';
import SCREEN_MAP from '../windows';
import { PlaybackSDKProvider } from '#/lib/playback-sdk-context';
import Screen from '../shared/screen';
import AlbumArt from './album-art';
import { Head } from './head';
import NoDeviceButton from './no-device-button';
import { observer } from '#/lib/playback-state-context/hooks';

export default function Main() {
  const { windows, windowsLength } = useWindowStore(
    useShallow(({ windows, windowTitles }) => ({
      windows,
      windowsLength: windowTitles.length
    }))
  );

  useEffect(() => {
    observer.updateResult();
  }, []);

  return (
    <PlaybackSDKProvider>
      <AlbumArt />
      <NoDeviceButton />
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

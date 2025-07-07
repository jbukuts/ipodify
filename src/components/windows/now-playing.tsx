import { memo, useEffect, useMemo, useState } from 'react';
import Screen from '../shared/screen';
import usePlaybackState from '#/lib/store/now-playing';
import useAddWindow from '#/hooks/useAddWindow';
import { Slider } from '../shared/slider';
import { useShallow } from 'zustand/react/shallow';
import { useInterval } from 'usehooks-ts';
import { useMutation } from '@tanstack/react-query';
import { sdk } from '#/lib/sdk';
import { BetterSmartMarquee } from '../shared/smart-marquee';

function formatTime(ms: number) {
  let seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  seconds = seconds % 60;

  return [
    hours > 0 ? String(hours).padStart(2, '0') : undefined,
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0')
  ]
    .filter((s) => !!s)
    .join(':');
}

function InternalNowPlaying() {
  const { item, progress, isPlaying, refetch } = usePlaybackState(
    useShallow(({ item, progress, isPlaying, refetch }) => ({
      progress,
      item,
      isPlaying,
      refetch
    }))
  );
  const goTo = useAddWindow();
  const [val, setValue] = useState(progress);

  useInterval(() => setValue((o) => o + 1000), isPlaying ? 1000 : null);
  useEffect(() => setValue(progress), [progress]);
  useEffect(() => refetch(), []);

  const { mutate: seek } = useMutation({
    mutationFn: (pos: number) => {
      return sdk.player.seekToPosition(pos);
    },
    onSettled: () => {
      setTimeout(refetch, 500);
    }
  });

  const artists = useMemo(
    () =>
      item && 'artists' in item
        ? item.artists
            .flatMap((a) => [
              <span
                role='button'
                className='hover:cursor-pointer hover:underline'
                key={a.id}
                onClick={goTo(a.name, 'Artist', { id: a.id })}>
                {a.name}
              </span>,
              ','
            ])
            .slice(0, -1)
        : [],
    [item, goTo]
  );

  useEffect(() => {
    console.log('sdfsfsfsdf');
  }, [goTo]);

  const searchLyrics = () => {
    if (!item || !('artists' in item)) return;
    window.open(
      `https://www.google.com/search?q=${encodeURI(item.name + ' ' + item.artists[0].name + ' lyrics')}`
    );
  };

  if (item === null)
    return (
      <Screen className='flex flex-col items-center justify-center text-fg'>
        Nothing is currently playing
      </Screen>
    );

  return (
    <Screen className='flex flex-col items-center justify-between gap-y-2 text-fg'>
      <div className='flex w-full grow flex-col items-center justify-center gap-y-2 overflow-clip'>
        <BetterSmartMarquee
          wrapperClassName='w-full'
          className='text-center'
          autoPlay>
          <span
            className='hover:cursor-pointer hover:underline'
            onClick={searchLyrics}>
            {item.name}
          </span>
        </BetterSmartMarquee>
        {'album' in item && (
          <BetterSmartMarquee
            autoPlay
            wrapperClassName='w-full'
            className='text-center'>
            <span
              className='hover:cursor-pointer hover:underline'
              onClick={goTo(item.album.name, 'Album', { id: item.album.id })}>
              {item.album.name}
            </span>
          </BetterSmartMarquee>
        )}
        {'artists' in item && (
          <BetterSmartMarquee
            autoPlay
            wrapperClassName='w-full'
            className='text-center'>
            {artists}
          </BetterSmartMarquee>
        )}
      </div>

      <Slider
        onMouseDown={() => console.log('down')}
        onValueChange={(e) => setValue(e[0])}
        onValueCommit={(e) => seek(e[0])}
        value={[val]}
        max={item?.duration_ms}
        min={0}
        className='w-[95%]'
      />
      <div className='mb-3 flex w-[95%] justify-between'>
        <p>{formatTime(val)}</p>
        <p>-{formatTime((item?.duration_ms ?? 0) - val)}</p>
      </div>
    </Screen>
  );
}

const NowPlaying = memo(InternalNowPlaying);
export default NowPlaying;

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Screen from '../shared/screen';
import useAddWindow from '#/hooks/use-add-window';
import { Slider } from '../shared/slider';
import { useShallow } from 'zustand/react/shallow';
import { useInterval } from 'usehooks-ts';
import { useMutation } from '@tanstack/react-query';
import { sdk } from '#/lib/sdk';
import { BetterSmartMarquee } from '../shared/smart-marquee';
import { formatTime } from '#/lib/utils';
import {
  useGlobalPlaybackState,
  useInvalidateGlobalPlaybackState
} from '#/lib/playback-state-context/hooks';

function InternalNowPlaying() {
  const refetch = useInvalidateGlobalPlaybackState();
  const { item, progress, isPlaying } = useGlobalPlaybackState(
    useShallow(({ item, progress, isPlaying }) => ({
      progress,
      item,
      isPlaying
    }))
  );
  const goTo = useAddWindow();
  const [localProgress, setLocalProgress] = useState(progress);
  const isDragging = useRef(false);

  useInterval(
    () => {
      setLocalProgress((o) => {
        const n = o + 1000;

        if (item && n >= item.duration_ms) {
          refetch();
          return 0;
        }

        return n;
      });
    },
    isPlaying ? 1000 : null
  );

  useEffect(() => {
    // pull latest data on mount
    refetch();
  }, []);

  useEffect(() => {
    if (!isDragging.current) setLocalProgress(progress);
  }, [progress]);

  const { mutate: seek } = useMutation({
    mutationFn: (pos: number) => {
      return sdk.player.seekToPosition(pos);
    },
    onSettled: () => {
      setTimeout(refetch, 500);
    }
  });

  const searchLyrics = useCallback(() => {
    if (!item || !('artists' in item)) return;
    window.open(
      `https://www.google.com/search?q=${encodeURI(item.name + ' ' + item.artists[0].name + ' lyrics')}`
    );
  }, [item]);

  const goToAlbum = useCallback(() => {
    if (!item || !('album' in item)) return;
    goTo(item.album.name, 'Album', { id: item.album.id })();
  }, [item, goTo]);

  const name = useMemo(
    () => (
      <span
        className='hover:cursor-pointer hover:underline'
        onClick={searchLyrics}>
        {item?.name}
      </span>
    ),
    [item]
  );

  const album = useMemo(
    () =>
      item &&
      'album' in item && (
        <span
          className='hover:cursor-pointer hover:underline'
          onClick={goToAlbum}>
          {item.album.name}
        </span>
      ),
    [item, goToAlbum]
  );

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
          {name}
        </BetterSmartMarquee>
        {'album' in item && (
          <BetterSmartMarquee
            autoPlay
            wrapperClassName='w-full'
            className='text-center'>
            {album}
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
        onPointerDown={() => (isDragging.current = true)}
        onPointerUp={() => (isDragging.current = false)}
        onValueChange={(e) => setLocalProgress(e[0])}
        onValueCommit={(e) => seek(e[0])}
        value={[localProgress]}
        max={item?.duration_ms}
        min={0}
        className='w-[95%]'
      />
      <div className='mb-3 flex w-[95%] justify-between'>
        <p>{formatTime(localProgress)}</p>
        <p>-{formatTime((item?.duration_ms ?? 0) - localProgress)}</p>
      </div>
    </Screen>
  );
}

const NowPlaying = memo(InternalNowPlaying);
export default NowPlaying;

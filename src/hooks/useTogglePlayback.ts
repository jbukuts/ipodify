import { sdk } from '#/lib/sdk';
import usePlaybackStateStore from '#/lib/store/playback-state-store';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { Logger } from '#/lib/logger';

const logger = new Logger('useTogglePlayback');

export function useTogglePlayback() {
  const { refetch, isPlaying, setIsPlaying, cancelQuery } =
    usePlaybackStateStore(
      useShallow(({ isPlaying, refetch, setIsPlaying, cancelQuery }) => ({
        isPlaying,
        setIsPlaying,
        refetch,
        cancelQuery
      }))
    );

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const previousState = isPlaying;

      await cancelQuery();
      setIsPlaying(!previousState);

      const fn = isPlaying ? 'pausePlayback' : 'startResumePlayback';
      await sdk.player[fn]('');
      return previousState;
    },
    onError: (err, _, context: boolean | undefined) => {
      logger.error(err);
      if (context) setIsPlaying(context);
    },
    onSettled: () => {
      setTimeout(() => refetch(), 500);
    }
  });

  return {
    toggle: () => {
      if (isPending) return;
      mutate();
    },
    isPlaying
  };
}

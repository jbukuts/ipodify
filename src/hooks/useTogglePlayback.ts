import { sdk } from '#/lib/sdk';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { Logger } from '#/lib/logger';
import {
  useGlobalPlaybackState,
  useInvalidateGlobalPlaybackState,
  useUpdateGlobalPlaybackState
} from '#/lib/playback-state-context/hooks';

const logger = new Logger('useTogglePlayback');

export function useTogglePlayback() {
  const update = useUpdateGlobalPlaybackState();
  const refetch = useInvalidateGlobalPlaybackState();
  const { isPlaying } = useGlobalPlaybackState(
    useShallow(({ isPlaying }) => ({
      isPlaying
    }))
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const previousState = isPlaying;

      await update({ isPlaying: !previousState });

      const fn = isPlaying ? 'pausePlayback' : 'startResumePlayback';
      await sdk.player[fn]('');
      return previousState;
    },
    onError: (err, _, context: boolean | undefined) => {
      logger.error(err);
      if (context) update({ isPlaying: context });
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

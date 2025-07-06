import { sdk } from '#/lib/sdk';
import usePlaybackState from '#/lib/store/now-playing';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { queryClient } from '#/lib/query';
import type { PlaybackState } from '@spotify/web-api-ts-sdk';

export function useTogglePlayback() {
  const { refetch, isPlaying } = usePlaybackState(
    useShallow(({ isPlaying, refetch }) => ({
      isPlaying,
      refetch
    }))
  );

  const { mutate } = useMutation({
    mutationFn: async () => {
      const p = queryClient.getQueryData(['now_playing_global']);

      queryClient.setQueryData(
        ['now_playing_global'],
        (old: PlaybackState) => ({
          ...old,
          is_playing: !isPlaying
        })
      );

      if (isPlaying) await sdk.player.pausePlayback('');
      else await sdk.player.startResumePlayback('');

      return p;
    },
    onError: (err, _, context: PlaybackState | null | undefined) => {
      console.error(err);
      if (!context) return;
      queryClient.setQueryData(['now_playing_global'], context);
    },
    onSuccess: () => {
      console.log('playback toggle. need to refetch');
    },
    onSettled: () => {
      setTimeout(refetch, 250);
    }
  });

  return mutate;
}

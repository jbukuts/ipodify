import { QueryObserver, useQueryClient } from '@tanstack/react-query';
import { FALLBACK_STATE, GLOBAL_PLAYBACK_KEY } from './constants';
import type { NowPlayingState } from './types';
import { useSyncExternalStore } from 'react';
import { queryClient } from '../query';
import { sdk } from '../sdk';

export const observer = new QueryObserver<NowPlayingState>(queryClient, {
  queryKey: [GLOBAL_PLAYBACK_KEY],
  initialData: FALLBACK_STATE,
  queryFn: () =>
    sdk.player
      .getPlaybackState()
      .then((r) => ({
        isPlaying: r.is_playing,
        device: r.device,
        item: r.item,
        context: r.context,
        progress: r.progress_ms ?? 0,
        volume: r.device.volume_percent ?? 0
      }))
      .catch(() => FALLBACK_STATE),
  refetchInterval: 5000,
  notifyOnChangeProps: 'all'
});

const subscriber = (onStoreChange: () => void) => {
  return observer.subscribe(() => {
    onStoreChange();
  });
};

export function useGlobalPlaybackState<T>(
  selector: (d: NowPlayingState) => T = (d) => d as T
) {
  const getSnapshot = () => {
    return selector(
      queryClient.getQueryData<NowPlayingState>([GLOBAL_PLAYBACK_KEY]) ??
        FALLBACK_STATE
    );
  };

  return useSyncExternalStore(subscriber, getSnapshot);
}

export function useInvalidateGlobalPlaybackState() {
  const client = useQueryClient();

  return () => {
    client.refetchQueries({ queryKey: [GLOBAL_PLAYBACK_KEY], type: 'all' });
  };
}

export function useUpdateGlobalPlaybackState() {
  const client = useQueryClient();

  return async (data: Partial<NowPlayingState>) => {
    await client.cancelQueries({ queryKey: [GLOBAL_PLAYBACK_KEY] });
    client.setQueryData([GLOBAL_PLAYBACK_KEY], (old: NowPlayingState) => ({
      ...old,
      ...data
    }));
  };
}

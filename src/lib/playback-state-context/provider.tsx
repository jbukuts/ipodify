import { useQuery } from '@tanstack/react-query';
import { sdk } from '../sdk';
import type { NowPlayingState } from './types';
import { FALLBACK_STATE, GLOBAL_PLAYBACK_KEY } from './constants';

export function GlobalPlaybackStateProvider() {
  useQuery<NowPlayingState>({
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

  return null;
}

import { create } from 'zustand';
import { sdk } from '../sdk';
import type { Context, Device, TrackItem } from '@spotify/web-api-ts-sdk';
import { Logger } from '../logger';
import { queryClient } from '../query';
import { QUERY_KEYS } from '../query-enum';

type Nullable<T> = T | null;

interface NowPlayingState {
  isPlaying: boolean;
  device: Nullable<Device>;
  item: Nullable<TrackItem>;
  context: Nullable<Context>;
  progress: number;
  volume: number;
}

interface NowPlayingStore extends NowPlayingState {
  setIsPlaying: (v: boolean) => void;
  setTrack: (t: TrackItem) => void;
  refetch: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  cancelQuery: () => Promise<void>;
}

export const PLAYBACK_STATE_QUERY_KEY = QUERY_KEYS.player.PLAYBACK_STATE;
const REFETCH_INTERVAL = 5_000;

const usePlaybackStateStore = create<NowPlayingStore>((set) => {
  let intervalId: null | NodeJS.Timeout = null;
  const logger = new Logger('usePlaybackState');

  const fetchData = async () => {
    logger.debug('Fetching playback state');
    const d = await queryClient
      .fetchQuery({
        queryKey: [PLAYBACK_STATE_QUERY_KEY],
        queryFn: () =>
          sdk.player.getPlaybackState().catch((e) => {
            const err = JSON.stringify(e);
            logger.error(e);
            if (err.includes('504') || err.includes('502')) return null;
            return '' as const;
          })
      })
      .catch(() => null);

    if (d === null) return;
    else if (d === '') {
      return set({
        isPlaying: false,
        device: null,
        item: null,
        context: null,
        progress: 0,
        volume: 0
      });
    }
    const { item, is_playing, device, context, progress_ms } = d;
    set({
      isPlaying: is_playing,
      device,
      context,
      item,
      progress: progress_ms,
      volume: device.volume_percent ?? 0
    });
  };

  const cancelQuery = async () => {
    await queryClient.cancelQueries({
      queryKey: [PLAYBACK_STATE_QUERY_KEY]
    });
  };

  return {
    isPlaying: false,
    device: null,
    item: null,
    context: null,
    progress: 0,
    volume: 0,
    setIsPlaying: (v: boolean) => {
      set({ isPlaying: v });
    },
    setTrack: async (t: TrackItem) => {
      await cancelQuery();
      set({ item: t, progress: 0 });
    },
    refetch: async () => {
      await cancelQuery();
      fetchData();
    },
    startPolling: () => {
      if (intervalId) return;
      fetchData();
      intervalId = setInterval(fetchData, REFETCH_INTERVAL);
    },
    stopPolling: () => {
      if (!intervalId) return;
      clearInterval(intervalId);
      intervalId = null;
    },
    cancelQuery
  };
});

export default usePlaybackStateStore;

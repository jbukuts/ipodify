import { create } from 'zustand';
import { sdk } from '../sdk';
import type { Context, Device, TrackItem } from '@spotify/web-api-ts-sdk';
import { Logger } from '../logger';
import { queryClient } from '../query';
import { QUERY_KEYS } from '../query-enum';

interface NowPlayingStore {
  isPlaying: boolean;
  device: Device | null;
  item: TrackItem | null;
  context: Context | null;
  progress: number;
  setIsPlaying: (v: boolean) => void;
  refetch: () => void;
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
    const d = await queryClient.fetchQuery({
      queryKey: [PLAYBACK_STATE_QUERY_KEY],
      queryFn: () => sdk.player.getPlaybackState().catch(() => undefined)
    });

    if (!d) {
      return set({
        isPlaying: false,
        device: null,
        item: null,
        context: null
      });
    }
    const { item, is_playing, device, context, progress_ms } = d;
    set({
      isPlaying: is_playing,
      device,
      context,
      item,
      progress: progress_ms
    });
  };

  return {
    isPlaying: false,
    device: null,
    item: null,
    context: null,
    progress: 0,
    setIsPlaying: (v: boolean) => {
      set({ isPlaying: v });
    },
    refetch: () => {
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
    cancelQuery: async () => {
      await queryClient.cancelQueries({
        queryKey: [PLAYBACK_STATE_QUERY_KEY]
      });
    }
  };
});

export default usePlaybackStateStore;

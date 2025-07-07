import { create } from 'zustand';
import { sdk } from '../sdk';
import type {
  Context,
  Device,
  PlaybackState,
  TrackItem
} from '@spotify/web-api-ts-sdk';
import { queryClient } from '../query';
import { QueryObserver } from '@tanstack/react-query';

interface NowPlayingStore {
  isPlaying: boolean;
  device: Device | null;
  item: TrackItem | null;
  context: Context | null;
  progress: number;
  refetch: () => void;
  startPolling: () => void;
  stopPolling: () => void;
}

const PLAYBACK_QUERY_KEY = 'now_playing_global';

const observer = new QueryObserver(queryClient, {
  queryKey: [PLAYBACK_QUERY_KEY]
});

const usePlaybackState = create<NowPlayingStore>((set) => {
  let intervalId: null | NodeJS.Timeout = null;

  const fetchData = async () => {
    const d = await sdk.player.getPlaybackState().catch(() => undefined);
    queryClient.setQueryData([PLAYBACK_QUERY_KEY], () => d);
  };

  observer.subscribe((result) => {
    if (result.data === undefined) {
      return set({
        isPlaying: false,
        device: null,
        item: null,
        context: null
      });
    }
    const { item, is_playing, device, context, progress_ms } =
      result.data as PlaybackState;

    set({
      isPlaying: is_playing,
      device,
      context,
      item,
      progress: progress_ms
    });
  });

  return {
    isPlaying: false,
    device: null,
    item: null,
    context: null,
    progress: 0,
    refetch: () => {
      console.log('fetching!');
      fetchData();
    },
    startPolling: () => {
      if (intervalId) return;
      fetchData();
      intervalId = setInterval(fetchData, 5000);
    },
    stopPolling: () => {
      if (!intervalId) return;
      clearInterval(intervalId);
      intervalId = null;
    }
  };
});

export default usePlaybackState;

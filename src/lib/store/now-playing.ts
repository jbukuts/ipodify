import { create } from 'zustand';
import { sdk } from '../auth';
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

const observer = new QueryObserver(queryClient, {
  queryKey: ['now_playing_global']
});

const usePlaybackState = create<NowPlayingStore>((set) => {
  let intervalId: null | NodeJS.Timeout = null;

  const fetchData = async () => {
    // await queryClient.prefetchQuery({
    //   queryKey: ['now_playing_global'],
    //   queryFn: () => sdk.player.getPlaybackState(),
    //   staleTime: 0
    // });

    sdk.player.getPlaybackState().then((state) => {
      if (state === null)
        return set({
          isPlaying: false,
          device: null,
          item: null,
          context: null
        });

      queryClient.setQueryData(['now_playing_global'], () => state);
    });
  };

  observer.subscribe((result) => {
    if (result.data === undefined) return;
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

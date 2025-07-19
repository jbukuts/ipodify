import type { Context, Device, TrackItem } from '@spotify/web-api-ts-sdk';

type Nullable<T> = T | null;

export interface NowPlayingState {
  isPlaying: boolean;
  device: Nullable<Device>;
  item: Nullable<TrackItem>;
  context: Nullable<Context>;
  progress: number;
  volume: number;
}

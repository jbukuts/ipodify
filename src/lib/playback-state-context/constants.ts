import type { NowPlayingState } from './types';

export const GLOBAL_PLAYBACK_KEY = 'GLOBAL_PLAYBACK';

export const FALLBACK_STATE: NowPlayingState = {
  isPlaying: false,
  device: null,
  item: null,
  context: null,
  progress: 0,
  volume: 0
};

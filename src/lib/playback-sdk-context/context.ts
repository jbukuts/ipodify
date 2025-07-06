import { createContext } from 'react';

export interface PlaybackSDKContext {
  player: Spotify.Player | undefined;
  ready: boolean;
  current: { id: string | null; uri: string; name: string } | undefined;
}

export const PlaybackContext = createContext<PlaybackSDKContext | undefined>(
  undefined
);

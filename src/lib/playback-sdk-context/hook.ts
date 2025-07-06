import { useContext } from 'react';
import { PlaybackContext } from './context';

export const usePlaybackSDKContext = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('useGlobalStore must be used within a GlobalStoreProvider');
  }
  return context;
};

import {
  useEffect,
  useState,
  type EffectCallback,
  type ReactNode
} from 'react';
import { sdk } from '../sdk';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';
import { PlaybackContext, type PlaybackSDKContext } from './context';
import { useGlobalPlaybackState } from '../playback-state-context/hooks';

const ALLOW_WEB_PLAYER = false;
const TRANSFER_ON_CONNECT = false;

function useOnSDKReady(fn?: EffectCallback) {
  const [script, setScript] = useState(false);

  useEffect(() => {
    if (script) return;
    if (
      !window.Spotify &&
      document.getElementById('playback-sdk-script') === null
    ) {
      const scriptTag = document.createElement('script');
      scriptTag.id = 'playback-sdk-script';
      scriptTag.src = 'https://sdk.scdn.co/spotify-player.js';
      document.head.appendChild(scriptTag);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      setScript(true);
    };
  }, [script]);

  useEffect(() => {
    if (!script || !fn) return;
    return fn();
  }, [script]);
}

export function PlaybackSDKProvider(props: { children: ReactNode }) {
  const { children } = props;

  const [player, setPlayer] = useState<Spotify.Player>();
  const [current, setCurrent] = useState<PlaybackSDKContext['current']>();
  const [ready, setReady] = useState(false);
  const [sdkPlayerId, setSDKPlayerID] = useState<string>();

  const refetch = () => null;
  const { device } = useGlobalPlaybackState(
    useShallow(({ device }) => ({ device }))
  );

  useOnSDKReady(() => {
    if (!ALLOW_WEB_PLAYER) return;
    console.log('create player!');

    const p = new Spotify.Player({
      name: 'ipodify',
      getOAuthToken: async (cb) => {
        const token = await sdk.getAccessToken();
        if (!token) throw new Error('No token. Cannot auth playback SDK');
        cb(token.access_token);
      },
      volume: 0.15
    });

    setPlayer(player);

    const handleReady: Spotify.PlaybackInstanceListener = (inst) => {
      const { device_id } = inst;
      console.log('Ready with Device ID', device_id);
      setReady(true);
      setSDKPlayerID(device_id);

      if (!device && TRANSFER_ON_CONNECT)
        sdk.player
          .transferPlayback([device_id], false)
          .then(() => {
            toast.success('Device connected');
          })
          .finally(() => {
            setTimeout(refetch, 250);
          });
    };

    const handleOffline: Spotify.PlaybackInstanceListener = ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
      setReady(false);
    };

    const handleError: Spotify.ErrorListener = ({ message }) => {
      console.error(message);
      toast.error(message);
      setReady(false);
    };

    const handleStateChange: Spotify.PlaybackStateListener = (state) => {
      const {
        track_window: { current_track }
      } = state;
      setCurrent({
        id: current_track.id,
        uri: current_track.uri,
        name: current_track.name
      });
    };

    p.addListener('player_state_changed', handleStateChange);
    p.addListener('ready', handleReady);
    p.addListener('not_ready', handleOffline);
    p.addListener('initialization_error', handleError);
    p.addListener('authentication_error', handleError);
    p.addListener('account_error', handleError);
    p.activateElement();
    p.connect();

    return () => {
      p.removeListener('player_state_changed', handleStateChange);
      p.removeListener('ready', handleReady);
      p.removeListener('not_ready', handleOffline);
      p.removeListener('initialization_error', handleError);
      p.removeListener('authentication_error', handleError);
      p.removeListener('account_error', handleError);
    };
  });

  return (
    <PlaybackContext.Provider value={{ player, ready, current, sdkPlayerId }}>
      {children}
    </PlaybackContext.Provider>
  );
}

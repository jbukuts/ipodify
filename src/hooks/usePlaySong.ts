import { QUERY_KEYS } from '#/lib/query-enum';
import { sdk } from '#/lib/sdk';
import usePlaybackStateStore from '#/lib/store/playback-state-store';
import type { Track } from '@spotify/web-api-ts-sdk';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

type PlaySongOpts = { deviceId?: string; track?: Track } & (
  | {
      contextUri: string;
      uris?: never;
      offset: number | string;
    }
  | { contextUri?: never; uris: string[]; offset: number }
);

export default function usePlaySong() {
  const client = useQueryClient();
  const { refetch, setTrack } = usePlaybackStateStore(
    useShallow(({ refetch, setTrack }) => ({ refetch, setTrack }))
  );

  return async (opts: PlaySongOpts) => {
    const { deviceId = '', track, uris, contextUri, offset } = opts;

    if (track) await setTrack(track);

    return sdk.player
      .startResumePlayback(deviceId, contextUri, uris, {
        [typeof offset === 'number' ? 'position' : 'uri']: offset
      })
      .then(() => {
        setTimeout(() => {
          refetch();
          client.invalidateQueries({ queryKey: [QUERY_KEYS.player.QUEUE] });
        }, 250);
      })
      .catch((e) => {
        console.error(e);
        let msg = 'There was an issue playing the track';

        if (e.message.includes('NO_ACTIVE_DEVICE'))
          msg = 'No active device. Could not play.';

        toast.error('Playback Error', { description: msg });
      });
  };
}

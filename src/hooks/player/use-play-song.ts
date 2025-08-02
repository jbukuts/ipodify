import {
  useInvalidateGlobalPlaybackState,
  useUpdateGlobalPlaybackState
} from '#/lib/playback-state-context/hooks';
import { QUERY_KEYS } from '#/lib/query-enum';
import { sdk } from '#/lib/sdk';
import type { Track } from '@spotify/web-api-ts-sdk';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
  const refetch = useInvalidateGlobalPlaybackState();
  const update = useUpdateGlobalPlaybackState();

  return async (opts: PlaySongOpts) => {
    const { deviceId = '', track, uris, contextUri, offset } = opts;

    if (track) await update({ item: track });

    return sdk.player
      .startResumePlayback(deviceId, contextUri, uris, {
        [typeof offset === 'number' ? 'position' : 'uri']: offset
      })
      .catch((e) => {
        console.error(e);
        let msg = 'There was an issue playing the track';

        if (e.message.includes('NO_ACTIVE_DEVICE'))
          msg = 'No active device. Could not play.';

        toast.error('Playback Error', { description: msg });
      })
      .finally(() => {
        setTimeout(() => {
          refetch();
          client.invalidateQueries({ queryKey: [QUERY_KEYS.player.QUEUE] });
        }, 250);
      });
  };
}

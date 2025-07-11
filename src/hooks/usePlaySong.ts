import { QUERY_KEYS } from '#/lib/query-enum';
import { sdk } from '#/lib/sdk';
import usePlaybackStateStore from '#/lib/store/playback-state-store';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

type PlaySongOpts = { deviceId?: string } & (
  | {
      contextUri: string;
      uris?: never;
      offset: number | string;
    }
  | { contextUri?: never; uris: string[]; offset: number }
);

export default function usePlaySong() {
  const client = useQueryClient();
  const refetch = usePlaybackStateStore(useShallow((s) => s.refetch));

  // const { mutate } = useMutation({
  //   mutationFn: async (opts: PlaySongOpts) => {
  //     const { deviceId = '', uris, contextUri, offset } = opts;

  //     return sdk.player.startResumePlayback(deviceId, contextUri, uris, {
  //       [typeof offset === 'number' ? 'position' : 'uri']: offset
  //     });
  //   },
  //   onSuccess: () => {
  //     setTimeout(refetch, 250);
  //   },
  //   onError: (e) => {
  //     console.error(e);
  //     let msg = 'There was an issue playing the track';

  //     if (e.message.includes('NO_ACTIVE_DEVICE'))
  //       msg = 'No active device. Could not play.';

  //     toast.error(msg);
  //   }
  // });

  return (opts: PlaySongOpts) => {
    const { deviceId = '', uris, contextUri, offset } = opts;

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

import { sdk } from '#/lib/auth';
import type { Episode, SimplifiedTrack, Track } from '@spotify/web-api-ts-sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function useAddToQueue() {
  const client = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (item: Track | SimplifiedTrack | Episode) =>
      sdk.player.addItemToPlaybackQueue(item.uri),
    onSuccess: (_, item) => {
      toast.success(
        <p>
          Added <b>{item.name}</b> to queue
        </p>
      );
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to add to queue');
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: ['queue'] });
    }
  });

  return mutate;
}

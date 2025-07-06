import { sdk } from '#/lib/sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function useRemoveFromPlaylist() {
  const client = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (opts: { playlistId: string; trackUris: string[] }) => {
      const { playlistId, trackUris } = opts;
      return sdk.playlists.removeItemsFromPlaylist(playlistId, {
        tracks: trackUris.map((s) => ({ uri: s }))
      });
    },
    onSuccess: (_, d) => {
      toast.success('Removed item from playlist');
      setTimeout(() => {
        client.invalidateQueries({
          queryKey: ['playlist', d.playlistId]
        });
        client.invalidateQueries({
          queryKey: ['playlist-tracks', d.playlistId]
        });
      }, 1000);
    },
    onError: (err) => {
      console.error(err);
      toast.success('Failed to remove item from playlist');
    }
  });

  return mutate;
}

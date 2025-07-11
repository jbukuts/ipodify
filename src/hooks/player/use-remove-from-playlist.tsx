import { QUERY_KEYS } from '#/lib/query-enum';
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
          queryKey: [QUERY_KEYS.playlist.GET, d.playlistId]
        });
        client.invalidateQueries({
          queryKey: [QUERY_KEYS.playlist.TRACKS, d.playlistId]
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

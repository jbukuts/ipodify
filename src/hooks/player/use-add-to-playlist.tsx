import { sdk } from '#/lib/sdk';
import type {
  Album,
  Episode,
  Playlist,
  SimplifiedAlbum,
  SimplifiedPlaylist,
  SimplifiedTrack,
  Track
} from '@spotify/web-api-ts-sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type Item = Track | SimplifiedTrack | Album | SimplifiedAlbum | Episode;
type P = Playlist | SimplifiedPlaylist;

export default function useAddToPlaylist() {
  const client = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (opts: { playlist: P; item: Item }) =>
      sdk.playlists.addItemsToPlaylist(opts.playlist.id, [opts.item.uri]),
    onSuccess: (_, v) => {
      setTimeout(() => {
        client.invalidateQueries({
          refetchType: 'all',
          queryKey: ['playlist-tracks', 'playlist', v.playlist.id]
        });
      }, 1000);
      toast.success('Added to playlist', {
        description: (
          <>
            Added <b>{v.item.name}</b> to <b>{v.playlist.name}</b>
          </>
        )
      });
    },
    onError: (e, v) => {
      console.error(e);
      toast.error('Failed to add to playlist', {
        description: (
          <>
            Could not add <b>{v.item.name}</b> to <b>{v.playlist.name}</b>
          </>
        )
      });
    }
  });

  return mutate;
}

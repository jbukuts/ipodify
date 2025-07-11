import { QUERY_KEYS } from '#/lib/query-enum';
import { sdk } from '#/lib/sdk';
import type { Album, SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function useAlbumSavedState(opts: {
  album: Album | SimplifiedAlbum;
  enabled?: boolean;
}) {
  const { album, enabled } = opts;
  const { name, id } = album;

  const client = useQueryClient();
  const { data: isSaved, refetch } = useQuery({
    queryKey: [QUERY_KEYS.album.IS_SAVED, id],
    queryFn: async () => {
      return sdk.currentUser.albums.hasSavedAlbums([id]);
    },
    select: (d) => d[0],
    initialData: [true],
    enabled
  });

  const { mutate: mutateSaved } = useMutation({
    mutationFn: () => {
      return sdk.makeRequest(isSaved ? 'DELETE' : 'PUT', 'me/albums', {
        ids: [album.id]
      });
    },
    onSuccess: () => {
      setTimeout(refetch, 1000);
      client.invalidateQueries({ queryKey: [QUERY_KEYS.album.SAVED_LIST] });
      toast.success(
        `${isSaved ? 'Removed' : 'Added'} ${name} ${isSaved ? 'from' : 'to'} library`
      );
    },
    onError: (e) => {
      console.error(e);
      toast.error(
        `Failed to ${isSaved ? 'remove' : 'add'} ${name} ${isSaved ? 'from' : 'to'} library`
      );
    }
  });

  return { isSaved, mutateSaved };
}

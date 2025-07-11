import type { TrackItemProps } from '#/components/shared/track-item';
import { QUERY_KEYS } from '#/lib/query-enum';
import { sdk } from '#/lib/sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type T = TrackItemProps['track'];

export default function useTrackSavedState(opts: {
  track: T;
  enabled?: boolean;
  initial?: boolean;
}) {
  const { track, enabled, initial = false } = opts;
  const { id, name } = track;

  const client = useQueryClient();
  const { data: isSaved, refetch } = useQuery({
    queryKey: [QUERY_KEYS.track.IS_SAVED, id],
    initialData: [initial ?? true],
    queryFn: () => sdk.currentUser.tracks.hasSavedTracks([id]),
    select: (d) => d[0],
    enabled: enabled && !initial
  });

  const { mutate: toggleLiked } = useMutation({
    mutationFn: () => {
      return sdk.makeRequest(isSaved ? 'DELETE' : 'PUT', 'me/tracks', {
        ids: [track.id]
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEYS.track.SAVED_LIST] });
      setTimeout(refetch, 500);
      toast.success(
        `${isSaved ? 'Removed' : 'Added'} ${name} ${isSaved ? 'from' : 'to'} Liked Songs`
      );
    },
    onError: (e) => {
      console.error(e);
      toast.error(
        `Failed to ${isSaved ? 'remove' : 'add'} ${name} ${isSaved ? 'from' : 'to'} Liked Songs`
      );
    }
  });

  return { isSaved, toggleLiked };
}

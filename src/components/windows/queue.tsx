import { sdk } from '#/lib/sdk';
import { useQuery } from '@tanstack/react-query';
import Screen from '../shared/screen';
import TrackItem from '../shared/track-item';
import { QUERY_KEYS } from '#/lib/query-enum';

export default function Queue() {
  const { data, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.player.QUEUE],
    initialData: { queue: [], currently_playing: null },
    queryFn: () => sdk.player.getUsersQueue()
  });

  const allRows = [
    ...(data.currently_playing ? [data.currently_playing] : []),
    ...data.queue
  ];

  return (
    <Screen loading={isFetching && data.currently_playing === null}>
      {allRows.map((track, idx) => (
        <TrackItem key={idx} trackNumber={idx + 1} track={track} />
      ))}
    </Screen>
  );
}

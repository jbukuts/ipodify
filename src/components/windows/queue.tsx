import { sdk } from '#/lib/auth';
import { useQuery } from '@tanstack/react-query';
import Screen from '../shared/screen';
import TrackItem from '../shared/track-item';

export default function Queue() {
  const { data, isFetching } = useQuery({
    queryKey: ['queue'],
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

import { useEffect, useState } from 'react';
import Screen from '../shared/screen';
import { useDebounce } from '@uidotdev/usehooks';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { sdk } from '#/lib/sdk';
import TrackItem from '../shared/track-item';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const deboucedTerm = useDebounce(searchTerm, 500);

  const { data } = useQuery({
    queryKey: ['search', deboucedTerm],
    queryFn: () =>
      sdk.search(deboucedTerm, ['album', 'playlist', 'track', 'artist'], 'US'),
    enabled: !!deboucedTerm && deboucedTerm !== '',
    placeholderData: keepPreviousData
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Screen>
      <div className='sticky top-0 flex h-8 flex-row gap-1 bg-bg'>
        <input
          className='h-full grow border-[0.125rem] border-fg px-1'
          type='text'
          placeholder='...'
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className='border-[0.125rem] border-fg px-1.5 text-fg transition-colors hover:cursor-pointer hover:bg-fg hover:text-bg'>
          Search
        </button>
      </div>

      {data?.tracks.items.map((track, idx) => (
        <TrackItem key={track.uri} track={track} trackNumber={idx + 1} />
      ))}
    </Screen>
  );
}

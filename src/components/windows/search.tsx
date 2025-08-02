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
    gcTime: 0,
    placeholderData: keepPreviousData
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Screen>
      <div className='sticky top-0 flex h-8 flex-row gap-1 bg-bg'>
        <input
          className='h-full grow border-[0.125rem] border-fg px-1 focus-within:outline-0'
          type='text'
          placeholder='...'
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {data?.tracks.items.map((track, idx) => (
        <TrackItem key={track.uri} track={track} trackNumber={idx + 1} />
      ))}
    </Screen>
  );
}

import { useState } from 'react';
import Screen from '../shared/screen';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { sdk } from '#/lib/sdk';
import TrackItem from '../shared/track-item';
import BadgeButton from '../shared/badge-button';
import AlbumItem from '../shared/album-item';
import ArtistItem from '../shared/artist-item';
import PlaylistItem from '../shared/playlist-item';
import useDebouncedState from '#/hooks/use-debouced-state';
import { Loader } from 'lucide-react';

const ITEM_TYPES = ['track', 'album', 'artist', 'playlist'] as const;

export default function Search() {
  const [filter, setFilter] = useState<(typeof ITEM_TYPES)[number]>('track');
  const [searchTerm, setSearchTerm] = useState('');
  const [deboucedSearchTerm, setDebouncedTerm] = useDebouncedState(
    searchTerm,
    500
  );

  const { data, isFetching } = useQuery({
    queryKey: ['search', deboucedSearchTerm],
    queryFn: () => sdk.search(deboucedSearchTerm, ITEM_TYPES, 'US'),
    enabled: !!deboucedSearchTerm && deboucedSearchTerm !== '',
    gcTime: 0,
    placeholderData: keepPreviousData
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    setDebouncedTerm(searchTerm);
  };

  return (
    <Screen>
      <div className='sticky top-0 h-8'>
        <input
          className='h-full w-full grow border-2 border-fg bg-bg px-1 focus-within:outline-0'
          type='text'
          placeholder='What do you want to play?'
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isFetching && (
          <Loader className='absolute top-1/2 right-1.5 -translate-y-1/2 animate-spin' />
        )}
      </div>

      <div className='flex h-8 flex-row items-center gap-1'>
        {ITEM_TYPES.map((item, idx) => (
          <BadgeButton
            key={idx}
            isActive={filter === item}
            onClick={() => setFilter(item)}>
            {item}
          </BadgeButton>
        ))}
      </div>

      {data && (
        <>
          {filter === 'track' &&
            data.tracks.items.map((track, idx) => (
              <TrackItem key={track.uri} track={track} trackNumber={idx + 1} />
            ))}
          {filter === 'album' &&
            data.albums.items.map((album) => (
              <AlbumItem key={album.uri} album={album} />
            ))}
          {filter === 'artist' &&
            data.artists.items.map((artist) => (
              <ArtistItem key={artist.uri} artist={artist} />
            ))}
          {filter === 'playlist' &&
            data.playlists.items
              .filter((n) => n !== null)
              .map((playlist) => (
                <PlaylistItem key={playlist.uri} playlist={playlist} />
              ))}
        </>
      )}
    </Screen>
  );
}

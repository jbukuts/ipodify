import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Screen from '../shared/screen';
import { sdk } from '#/lib/auth';
import { memo, useState } from 'react';
import TrackItem from '../shared/track-item';
import usePlaySong from '#/hooks/usePlaySong';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shared/tabs';
import AlbumItem from '../shared/album-item';
import { cn } from '#/lib/utils';
import BetterVirtualScreen from '../shared/better-virtual-screen';

const ALBUM_GROUPS = ['album', 'single', 'appears_on', 'compilation'] as const;

function ArtistAlbums(props: { id: string }) {
  const { id } = props;
  const [group, setGroup] = useState<(typeof ALBUM_GROUPS)[number]>('album');

  const {
    data = [],
    isLoading,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['artist_albums', group, id],
    queryFn: ({ pageParam }) =>
      sdk.artists.albums(id, group, 'US', 50, pageParam),
    initialPageParam: 0,
    placeholderData: (p) => p,
    getNextPageParam: (lastPage) =>
      lastPage.next ? lastPage.offset + 50 : undefined,
    select: (d) => d.pages.flatMap((p) => p.items)
  });

  const selectGroup = (g: typeof group) => {
    return () => setGroup(g);
  };

  return (
    <TabsContent value='albums'>
      <BetterVirtualScreen
        loaded={data.length + 1}
        loading={isLoading}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}>
        {({ index, style }) => {
          if (index === 0) {
            return (
              <div
                className='flex h-8 flex-row items-center gap-1'
                style={style}>
                {ALBUM_GROUPS.map((g) => (
                  <button
                    onClick={selectGroup(g)}
                    className={cn(
                      'h-min rounded-full border-[0.0625rem] border-fg px-1.5 py-0.25 text-xs whitespace-nowrap text-fg capitalize hover:cursor-pointer',
                      group === g && 'bg-fg text-bg'
                    )}
                    key={g}>
                    {g.replaceAll('_', ' ')}
                  </button>
                ))}
              </div>
            );
          }

          const a = data[index - 1];
          return <AlbumItem album={a} style={style} />;
        }}
      </BetterVirtualScreen>
    </TabsContent>
  );
}

function ArtistTracks(props: { id: string }) {
  const { id } = props;

  const playSong = usePlaySong();
  const { data = [], isLoading } = useQuery({
    queryKey: ['artist_tracks', id],
    queryFn: () => sdk.artists.topTracks(id, 'US'),
    select: (d) => d.tracks
  });

  const handlePlaySong = (idx: number) => {
    if (data.length > 0) return;
    playSong({ uris: data.map((t) => t.uri), offset: idx });
  };

  return (
    <Screen loading={isLoading} asChild>
      <TabsContent value='songs'>
        {data.map((t, idx) => (
          <TrackItem
            key={idx}
            trackNumber={idx + 1}
            track={t}
            onClick={() => handlePlaySong(idx)}
          />
        ))}
      </TabsContent>
    </Screen>
  );
}

function InternalArtist(props: { id: string }) {
  const { id } = props;

  return (
    <Screen asChild className='overflow-hidden pt-0'>
      <Tabs defaultValue='songs'>
        <TabsList className='w-full'>
          <TabsTrigger value='meta'>Meta</TabsTrigger>
          <TabsTrigger value='songs'>Top Songs</TabsTrigger>
          <TabsTrigger value='albums'>Albums</TabsTrigger>
          <TabsTrigger value='related'>Related</TabsTrigger>
        </TabsList>

        <TabsContent value='meta'></TabsContent>
        <ArtistTracks id={id} />
        <ArtistAlbums id={id} />
      </Tabs>
    </Screen>
  );
}

const Artist = memo(InternalArtist);
export default Artist;

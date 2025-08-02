import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import Screen from '../shared/screen';
import { sdk } from '#/lib/sdk';
import { memo, useState } from 'react';
import TrackItem from '../shared/track-item';
import usePlaySong from '#/hooks/player/use-play-song';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shared/tabs';
import AlbumItem from '../shared/album-item';
import { cn } from '#/lib/utils';
import BetterVirtualScreen from '../shared/better-virtual-screen';
import { QUERY_KEYS } from '#/lib/query-enum';

const ALBUM_GROUPS = ['album', 'single', 'appears_on', 'compilation'] as const;

enum Tab {
  TRACKS = 'tracks',
  ALBUMS = 'ablums',
  RELATED = 'related',
  ABOUT = 'about'
}

type ArtistTabProps = { id: string };

function ArtistAlbums(props: ArtistTabProps) {
  const { id } = props;
  const [group, setGroup] = useState<(typeof ALBUM_GROUPS)[number]>('album');

  const {
    data = [],
    isLoading,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.artist.ALBUMS, group, id],
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
    <TabsContent value={Tab.ALBUMS}>
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

function ArtistTracks(props: ArtistTabProps) {
  const { id } = props;

  const playSong = usePlaySong();
  const { data = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.artist.TRACKS, id],
    queryFn: () => sdk.artists.topTracks(id, 'US'),
    select: (d) => d.tracks
  });

  const handlePlaySong = (idx: number) => {
    if (data.length === 0) return;
    playSong({ track: data[idx], uris: data.map((t) => t.uri), offset: idx });
  };

  return (
    <Screen loading={isLoading} asChild>
      <TabsContent value={Tab.TRACKS}>
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

function useToggleArtistFollowed(id: string) {
  const client = useQueryClient();
  const { data: isFollowed, refetch } = useQuery({
    queryKey: [QUERY_KEYS.artist.IS_SAVED, id],
    initialData: [false],
    queryFn: () => sdk.currentUser.followsArtistsOrUsers([id], 'artist'),
    select: (d) => d[0]
  });

  const { mutate: toggledFollowed } = useMutation({
    mutationFn: async () => {
      const fn = isFollowed ? 'unfollowArtistsOrUsers' : 'followArtistsOrUsers';
      client.setQueryData(
        [QUERY_KEYS.artist.IS_SAVED, id],
        (old: [boolean]) => [!old[0]]
      );
      await sdk.currentUser[fn]([id], 'artist');
      return { isFollowed };
    },
    onError: (_err, _, ctx: { isFollowed: boolean } | undefined) => {
      client.setQueryData(
        [QUERY_KEYS.artist.IS_SAVED, id],
        [!!ctx?.isFollowed]
      );
    },
    onSuccess: () => {
      setTimeout(refetch, 500);
      client.invalidateQueries({ queryKey: [QUERY_KEYS.artist.SAVED_LIST] });
    }
  });

  return { isFollowed, toggledFollowed };
}

function ArtistInfo(props: ArtistTabProps) {
  const { id } = props;

  const { isFollowed, toggledFollowed } = useToggleArtistFollowed(id);
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.artist.ABOUT, id],
    queryFn: () => sdk.artists.get(id)
  });

  return (
    <Screen loading={isLoading} asChild>
      <TabsContent
        value={Tab.ABOUT}
        className='grid auto-rows-auto grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-2'>
        <img
          className='row-span-full size-30 border-[0.125rem] border-fg object-cover object-center'
          src={data?.images[0].url}
        />
        <button onClick={() => toggledFollowed()}>{String(isFollowed)}</button>
        <p className='text-xl'>{data?.name}</p>
        <p className='col-start-2 row-start-2'>
          {data?.followers.total} followers
        </p>
      </TabsContent>
    </Screen>
  );
}

function InternalArtist(props: { id: string }) {
  const { id } = props;

  return (
    <Screen asChild className='overflow-hidden pt-0'>
      <Tabs defaultValue={Tab.TRACKS}>
        <TabsList className='w-full'>
          <TabsTrigger value={Tab.TRACKS}>Top Songs</TabsTrigger>
          <TabsTrigger value={Tab.ALBUMS}>Albums</TabsTrigger>
          <TabsTrigger value={Tab.ABOUT}>About</TabsTrigger>
        </TabsList>

        <ArtistInfo id={id} />
        <ArtistTracks id={id} />
        <ArtistAlbums id={id} />
      </Tabs>
    </Screen>
  );
}

const Artist = memo(InternalArtist);
export default Artist;

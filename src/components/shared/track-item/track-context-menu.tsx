import { useState } from 'react';
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger
} from '../context-menu';
import type { TrackItemProps } from './track-item';
import SmartMarquee from '../smart-marquee';
import useAddWindow from '#/hooks/useAddWindow';
import useAddToQueue from '#/hooks/player/use-add-to-queue';
import useSavedPlaylists from '#/hooks/player/use-saved-playlists';
import useAddToPlaylist from '#/hooks/player/use-add-to-playlist';
import useRemoveFromPlaylist from '#/hooks/player/use-remove-from-playlist';
import useTrackSavedState from '#/hooks/player/use-track-saved-state';

type TrackItemContextMenuProps = { open: boolean } & Pick<
  TrackItemProps,
  'track' | 'isLiked' | 'playlistId' | 'showGoToAlbum'
>;

function TrackSubContextMenu(props: {
  track: TrackItemContextMenuProps['track'];
}) {
  const { track } = props;

  const [isSubOpen, setIsSubOpen] = useState(false);
  const { playlists, isLoading } = useSavedPlaylists({
    enabled: isSubOpen,
    ownerOnly: true
  });
  const addToPlaylist = useAddToPlaylist();

  return (
    <ContextMenuSub onOpenChange={setIsSubOpen}>
      <ContextMenuSubTrigger>Add to playlist</ContextMenuSubTrigger>
      <ContextMenuSubContent className='max-h-80 overflow-y-auto'>
        <ContextMenuItem disabled>New Playlist</ContextMenuItem>
        <ContextMenuSeparator />
        {!isLoading ? (
          playlists.map((p, idx) => (
            <ContextMenuItem
              key={idx}
              onSelect={(e) => e.preventDefault()}
              className='truncate'
              onClick={() => addToPlaylist({ item: track, playlist: p })}>
              {p.name}
            </ContextMenuItem>
          ))
        ) : (
          <ContextMenuLabel className='animate-pulse text-center'>
            ...
          </ContextMenuLabel>
        )}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}

export default function TrackContextMenu(props: TrackItemContextMenuProps) {
  const { track, open, isLiked, playlistId, showGoToAlbum = true } = props;

  const goTo = useAddWindow();
  const addToQueue = useAddToQueue();
  const removeFromPlaylist = useRemoveFromPlaylist();
  const { toggleLiked, isSaved } = useTrackSavedState({
    track,
    enabled: open,
    initial: isLiked
  });

  return (
    <ContextMenuContent>
      {'album' in track && (
        <>
          <ContextMenuLabel className='grid w-60 grid-cols-[auto_1fr] grid-rows-[repeat(auto,4)] items-center gap-x-3 [&_*]:text-xs'>
            <img
              className='col-span-1 row-span-4 size-20 rounded-sm border-[0.0625rem] border-fg'
              src={
                track.album.images.length > 0 ? track.album.images[0].url : ''
              }
            />
            <SmartMarquee className='row-span-1'>{track.name}</SmartMarquee>
            <SmartMarquee className='row-span-1'>
              {track.artists.map((a) => a.name).join(',')}
            </SmartMarquee>
            <SmartMarquee className='row-span-1'>
              {track.album.name}
            </SmartMarquee>
            <SmartMarquee className='row-span-1'>
              {new Date(track.album.release_date).getFullYear()}
            </SmartMarquee>
          </ContextMenuLabel>
          <ContextMenuSeparator />
        </>
      )}

      <TrackSubContextMenu track={track} />

      {playlistId && (
        <ContextMenuItem
          onClick={() =>
            removeFromPlaylist({ playlistId, trackUris: [track.uri] })
          }>
          Remove from this playlist
        </ContextMenuItem>
      )}

      <ContextMenuItem onClick={() => toggleLiked()}>
        {isSaved ? 'Remove from' : 'Add to'} Liked Songs
      </ContextMenuItem>
      <ContextMenuItem onClick={() => addToQueue(track)}>
        Add to queue
      </ContextMenuItem>
      <ContextMenuSeparator />
      {'artists' in track &&
        (track.artists.length === 1 ? (
          <ContextMenuItem
            onClick={goTo(track.artists[0].name, 'Artist', {
              id: track.artists[0].id
            })}>
            Go to artist
          </ContextMenuItem>
        ) : (
          <ContextMenuSub>
            <ContextMenuSubTrigger>Go to artist</ContextMenuSubTrigger>
            <ContextMenuSubContent className='w-44'>
              {track.artists
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((a) => (
                  <ContextMenuItem
                    onClick={goTo(a.name, 'Artist', { id: a.id })}>
                    {a.name}
                  </ContextMenuItem>
                ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        ))}

      {showGoToAlbum && 'album' in track && (
        <ContextMenuItem
          onClick={goTo(track.album.name, 'Album', {
            id: track.album.id
          })}>
          Go to album
        </ContextMenuItem>
      )}
    </ContextMenuContent>
  );
}

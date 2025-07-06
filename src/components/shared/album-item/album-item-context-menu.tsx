import useAlbumSavedState from '#/hooks/player/use-album-saved-state';
import useAddWindow from '#/hooks/useAddWindow';
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger
} from '../context-menu';
import SmartMarquee from '../smart-marquee';
import type { AlbumItemProps } from './album-item';

interface AlbumContextMenuProps extends Pick<AlbumItemProps, 'album'> {
  open: boolean;
}

export default function AlbumContextMenu(props: AlbumContextMenuProps) {
  const { album, open } = props;

  const goTo = useAddWindow();
  const { isSaved, mutateSaved } = useAlbumSavedState({ album, enabled: open });

  return (
    <ContextMenuContent>
      <ContextMenuLabel className='grid w-60 grid-cols-[auto_1fr] grid-rows-[repeat(auto,4)] items-center gap-x-3 [&_*]:text-xs'>
        <img
          className='col-span-1 row-span-4 size-20 rounded-sm border-[0.0625rem] border-fg'
          src={album.images[0].url}
        />
        <SmartMarquee className='row-span-1'>{album.name}</SmartMarquee>
        <SmartMarquee className='row-span-1'>
          {album.artists.map((a) => a.name).join(',')}
        </SmartMarquee>

        <SmartMarquee className='row-span-1'>
          {new Date(album.release_date).getFullYear()}
        </SmartMarquee>
      </ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => mutateSaved()}>
        {isSaved ? 'Remove from' : 'Add to'} Library
      </ContextMenuItem>
      <ContextMenuSeparator />
      {album.artists.length === 1 ? (
        <ContextMenuItem
          onClick={goTo(album.artists[0].name, 'Artist', {
            id: album.artists[0].id
          })}>
          Go to artist
        </ContextMenuItem>
      ) : (
        <ContextMenuSub>
          <ContextMenuSubTrigger>Go to artist</ContextMenuSubTrigger>
          <ContextMenuSubContent className='w-44'>
            {album.artists
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((a) => (
                <ContextMenuItem
                  key={a.id}
                  onClick={goTo(a.name, 'Artist', { id: a.id })}>
                  {a.name}
                </ContextMenuItem>
              ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
      )}
    </ContextMenuContent>
  );
}

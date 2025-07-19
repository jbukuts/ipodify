import { memo, useState, type ComponentProps } from 'react';
import { useShallow } from 'zustand/react/shallow';
import MenuItem from '../menu-item';
import type { Album, SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import { ChevronRight, Volume } from 'lucide-react';
import useAddWindow from '#/hooks/useAddWindow';
import { ContextMenu, ContextMenuTrigger } from '../context-menu';
import AlbumContextMenu from './album-item-context-menu';
import { useGlobalPlaybackState } from '#/lib/playback-state-context/hooks';

export type AlbumItemProps = ComponentProps<typeof MenuItem> & {
  album: Album | SimplifiedAlbum;
};

const AlbumItem = memo((props: AlbumItemProps) => {
  const { album, style } = props;

  const [open, setOpen] = useState(false);
  const goTo = useAddWindow();
  const item = useGlobalPlaybackState(
    useShallow(({ item }) => (item && 'album' in item ? item.album : undefined))
  );

  return (
    <ContextMenu onOpenChange={setOpen}>
      <ContextMenuTrigger asChild>
        <MenuItem
          style={style}
          onClick={goTo(album.name, 'Album', { id: album.id })}
          icon={
            item && item.id === album.id ? [Volume, ChevronRight] : undefined
          }>
          {album.name}
        </MenuItem>
      </ContextMenuTrigger>
      <AlbumContextMenu album={album} open={open} />
    </ContextMenu>
  );
});

export default AlbumItem;

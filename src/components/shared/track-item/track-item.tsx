import type { Episode, SimplifiedTrack, Track } from '@spotify/web-api-ts-sdk';
import { ContextMenu, ContextMenuTrigger } from '../context-menu';
import MenuItem from '../menu-item';
import { memo, useState, type ComponentProps } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Volume1 } from 'lucide-react';
import TrackContextMenu from './track-context-menu';
import { useGlobalPlaybackState } from '#/lib/playback-state-context/hooks';

export interface TrackItemProps
  extends Pick<ComponentProps<typeof MenuItem>, 'style' | 'onClick'> {
  track: Track | SimplifiedTrack | Episode;
  trackNumber?: number;
  isLiked?: boolean;
  playlistId?: string;
  showGoToAlbum?: boolean;
}

export default memo(function TrackItem(props: TrackItemProps) {
  const {
    track,
    trackNumber,
    onClick,
    isLiked,
    playlistId,
    showGoToAlbum = true,
    ...rest
  } = props;
  const [open, setOpen] = useState(false);

  const prefix =
    trackNumber ?? ('track_number' in track ? track.track_number : null);
  const trackNumberContent = prefix ? `${prefix}. ` : null;

  const trackId = useGlobalPlaybackState(useShallow((s) => s.item?.id));

  const handleClick =
    onClick &&
    ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!onClick) return;
      onClick(e);
    });

  return (
    <ContextMenu onOpenChange={setOpen}>
      <ContextMenuTrigger asChild>
        <MenuItem
          disabled={
            (track.is_playable && !track.is_playable) || !!track.restrictions
          }
          onClick={handleClick}
          {...rest}
          icon={
            trackId === track.id ||
            ('linked_from' in track && track.linked_from?.id === trackId)
              ? Volume1
              : false
          }>
          {trackNumberContent}
          {track.name}
        </MenuItem>
      </ContextMenuTrigger>
      <TrackContextMenu
        {...{ track, open, isLiked, playlistId, showGoToAlbum }}
      />
    </ContextMenu>
  );
});

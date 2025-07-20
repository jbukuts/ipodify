import useAddWindow from '#/hooks/useAddWindow';
import { useGlobalPlaybackState } from '#/lib/playback-state-context/hooks';
import useWindowStore from '#/lib/store/window-store';
import { cn } from '#/lib/utils';
import { useShallow } from 'zustand/react/shallow';

export default function AlbumArt() {
  const goTo = useAddWindow();
  const isCurrentNowPlaying = useWindowStore(
    useShallow((s) => s.windows[s.windows.length - 1][0] === 'NowPlaying')
  );
  const images = useGlobalPlaybackState(
    useShallow(({ item }) =>
      item && 'album' in item ? item.album.images : null
    )
  );

  const handleClick = () => {
    if (isCurrentNowPlaying) return;
    goTo('Now Playing', 'NowPlaying')();
  };

  return (
    <button
      className={cn(
        'fixed top-[calc(50%-6rem)] left-[50%] z-0 size-50 translate-[-50%] overflow-hidden rounded-md transition-[scale,top] hover:top-[calc(50%-12rem)] not-disabled:hover:cursor-pointer not-disabled:active:scale-110'
      )}
      disabled={isCurrentNowPlaying}>
      {images && images.length > 0 && (
        <img onClick={handleClick} src={images[0].url} />
      )}
    </button>
  );
}

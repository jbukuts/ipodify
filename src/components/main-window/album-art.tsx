import useAddWindow from '#/hooks/useAddWindow';
import usePlaybackStateStore from '#/lib/store/playback-state-store';
import useWindowStore from '#/lib/store/window-store';
import { useShallow } from 'zustand/react/shallow';

export default function AlbumArt() {
  const goTo = useAddWindow();
  const currentWindowType = useWindowStore(
    useShallow((s) => s.windows[s.windows.length - 1][0])
  );
  const images = usePlaybackStateStore(
    useShallow(({ item }) =>
      item && 'album' in item ? item.album.images : null
    )
  );

  const handleClick = () => {
    if (currentWindowType === 'NowPlaying') return;
    goTo('Now Playing', 'NowPlaying')();
  };

  return (
    <>
      {images && images.length > 0 && (
        <img
          onClick={handleClick}
          className='fixed top-[calc(50%-6rem)] left-[50%] z-0 size-50 translate-[-50%] rounded-md transition-[top] hover:top-[calc(50%-12rem)] hover:cursor-pointer'
          src={images[0].url}
        />
      )}
    </>
  );
}

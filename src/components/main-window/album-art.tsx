import useAddWindow from '#/hooks/useAddWindow';
import usePlaybackStateStore from '#/lib/store/playback-state-store';
import { useShallow } from 'zustand/react/shallow';

export default function AlbumArt() {
  const goTo = useAddWindow();
  const { images } = usePlaybackStateStore(
    useShallow(({ item }) => ({
      images: item && 'album' in item ? item.album.images : null
    }))
  );

  return (
    <>
      {images && images.length > 0 && (
        <img
          onClick={goTo('Now Playing', 'NowPlaying')}
          className='fixed top-[calc(50%-6rem)] left-[50%] z-0 size-50 translate-[-50%] rounded-md transition-[top] hover:top-[calc(50%-12rem)] hover:cursor-pointer'
          src={images[0].url}
        />
      )}
    </>
  );
}

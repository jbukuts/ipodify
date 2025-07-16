import { Fullscreen, Minimize } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FullscreenButton() {
  const [fullscreen, setFullScreen] = useState(false);

  useEffect(() => {
    const onFullScreenChange = () => {
      setFullScreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', onFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullScreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <button
      type='button'
      title='toggle fullscreen'
      className='fixed right-1 bottom-1 hover:cursor-pointer'
      onClick={toggleFullscreen}>
      {fullscreen ? <Minimize /> : <Fullscreen />}
    </button>
  );
}

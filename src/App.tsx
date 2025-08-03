import { useEffect, useRef, useState } from 'react';
import { sdk } from './lib/sdk';
import Main from './components/main-window';
import { Toaster as Sonner } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { useGlobalPlaybackState } from './lib/playback-state-context/hooks';
import Blobs from './components/blobs';
import useTheme from './hooks/use-theme';

function App() {
  const [authed, setAuthed] = useState(false);
  const theme = useTheme();
  const htmlElementRef = useRef(document.body.parentElement);
  const title = useGlobalPlaybackState(
    useShallow((s) => {
      const album =
        s.item && 'artists' in s.item ? s.item.artists[0].name : undefined;
      const title = s.item?.name;

      return album && title ? `${album} - ${title}` : '(ipodify)';
    })
  );

  useEffect(() => {
    // change page theme when data theme is updated
    htmlElementRef.current?.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // handle change page title when song changes
    document.title = title;
  }, [title]);

  useEffect(() => {
    sdk
      .authenticate()
      .then((r) => {
        setAuthed(r.authenticated);
      })
      .catch(() => {
        window.history.replaceState(
          null,
          '',
          window.location.origin + window.location.pathname
        );
      });
  }, []);

  return (
    <>
      <Blobs />
      {authed && <Main />}
      <Sonner
        theme={theme}
        position='top-center'
        richColors
        gap={4}
        icons={undefined}
        toastOptions={{
          classNames: {
            icon: '[&>svg]:size-5 size-5! m-0!',
            toast:
              'font-mono flex flex-row-reverse justify-between rounded-none!',
            title: 'text-[0.65rem] font-semibold'
          }
        }}
      />
    </>
  );
}

export default App;

import { useEffect, useRef, useState } from 'react';
import { sdk } from './lib/sdk';
import Main from './components/main';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query';
import { Toaster as Sonner } from 'sonner';
import useAppSettings from './hooks/useAppSettings';

function App() {
  const [authed, setAuthed] = useState(false);
  const [{ theme }] = useAppSettings();
  const r = useRef(document.body);

  useEffect(() => {
    r.current.parentElement?.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    sdk.authenticate().then((r) => {
      setAuthed(r.authenticated);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {authed && <Main />}
      <Sonner
        {...{ theme: 'dark' }}
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
    </QueryClientProvider>
  );
}

export default App;

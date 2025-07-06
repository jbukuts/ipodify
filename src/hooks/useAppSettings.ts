import { useLocalStorage } from 'usehooks-ts';

interface AppSettings {
  clock: boolean;
  theme: 'light' | 'dark';
}

export default function useAppSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    'ispodify.settings',
    {
      clock: false,
      theme: 'light'
    }
  );

  return [settings, setSettings] as const;
}

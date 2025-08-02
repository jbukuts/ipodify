import { useLocalStorage } from 'usehooks-ts';

interface AppSettings {
  clock: boolean;
  theme: 'light' | 'dark';
  enableAnimation: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  clock: false,
  theme: 'light',
  enableAnimation: false
};

export default function useAppSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    'ispodify.settings',
    DEFAULT_SETTINGS
  );

  const update = (
    updated: Partial<AppSettings> | ((u: AppSettings) => Partial<AppSettings>)
  ) => {
    if (typeof updated === 'function') {
      setSettings((old) => {
        const n = updated(old);
        return { ...old, ...n };
      });
    }

    setSettings((old) => ({ ...old, ...updated }));
  };

  return [settings, update] as const;
}

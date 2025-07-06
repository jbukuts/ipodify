import { useEffect } from 'react';
import { STORAGE_EVENT_KEY } from '#/lib/sdk/constants';
import { useLocalStorage } from '@uidotdev/usehooks';

export default function useReadLocalStorage<T>(key: string) {
  const [val, setVal] = useLocalStorage<T>(key);

  useEffect(() => {
    const handler = (e: Event) => {
      const { detail } = e as CustomEvent;
      if (detail.key !== key) return;
      setVal(JSON.parse(detail.value));
    };

    window.addEventListener(STORAGE_EVENT_KEY, handler);

    return () => {
      window.removeEventListener(STORAGE_EVENT_KEY, handler);
    };
  }, [key, setVal]);

  return val;
}

import useWindowStore from '#/lib/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';

export default function useAddWindow() {
  const addWindow = useWindowStore(useShallow((s) => s.addWindow));
  return useCallback(
    (...opts: Parameters<typeof addWindow>) => {
      return () => addWindow(...opts);
    },
    [addWindow]
  );
}

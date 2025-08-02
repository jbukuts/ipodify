import type { MenuType } from '#/components/windows';
import useWindowStore from '#/lib/store/window-store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';

export default function useAddWindow() {
  const addWindow = useWindowStore(useShallow((s) => s.addWindow));

  return useCallback(
    <T extends MenuType>(...opts: Parameters<typeof addWindow<T>>) => {
      return () => addWindow(...opts);
    },
    [addWindow]
  );
}

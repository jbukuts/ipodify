import useWindowStore from '#/lib/store';
import { useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { useShallow } from 'zustand/react/shallow';
import useTime from './useTime';
import useAppSettings from './useAppSettings';

const TOGGLE_TIME = 5000;

export default function useWindowTitle() {
  const [{ clock }] = useAppSettings();

  const windowTitle = useWindowStore(
    useShallow((s) => s.windowTitles[s.windowTitles.length - 1])
  );

  const [showClock, setShowClock] = useState(false);
  useInterval(() => setShowClock((o) => !o), clock ? TOGGLE_TIME : null);

  const time = useTime();

  return showClock && clock
    ? time.toLocaleDateString('en-US', {
        hour12: true,
        minute: '2-digit',
        hour: '2-digit',
        second: '2-digit'
      })
    : windowTitle;
}

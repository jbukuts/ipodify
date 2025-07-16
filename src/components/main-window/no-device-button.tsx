import useAddWindow from '#/hooks/useAddWindow';
import usePlaybackStateStore from '#/lib/store/playback-state-store';
import useWindowStore from '#/lib/store/window-store';
import { useShallow } from 'zustand/react/shallow';

export default function NoDeviceButton() {
  const goTo = useAddWindow();
  const { device } = usePlaybackStateStore(
    useShallow(({ device, startPolling, stopPolling }) => ({
      device,
      startPolling,
      stopPolling
    }))
  );

  const windows = useWindowStore(useShallow(({ windows }) => windows));

  return (
    device === null &&
    windows[windows.length - 1][0] !== 'Devices' && (
      <button
        className='fixed bottom-[calc(50%-13.5rem)] left-1/2 translate-[-50%] rounded-md border-[0.125rem] border-black px-2.5 py-1 font-mono text-xs font-semibold text-black hover:cursor-pointer'
        type='button'
        onClick={goTo('Devices', 'Devices')}>
        Select a device
      </button>
    )
  );
}

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
  const show = device === null && windows[windows.length - 1][0] !== 'Devices';

  return (
    show && (
      <button
        data-hidden={show}
        style={{ mixBlendMode: 'difference' }}
        className='fixed bottom-[calc(50%+10rem)] left-1/2 translate-[-50%] rounded-md border-[0.125rem] border-white px-2.5 py-1 font-mono text-xs font-semibold text-white transition-colors animate-in fade-in hover:cursor-pointer hover:bg-white hover:text-black'
        type='button'
        onClick={goTo('Devices', 'Devices')}>
        SELECT DEVICE
      </button>
    )
  );
}

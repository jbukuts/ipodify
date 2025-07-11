import { useMutation, useQuery } from '@tanstack/react-query';
import Screen from '../shared/screen';
import { sdk } from '#/lib/sdk';
import MenuItem from '../shared/menu-item';
import usePlaybackState from '#/lib/store/now-playing';
import { Check } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { QUERY_KEYS } from '#/lib/query-enum';

export default function Devices() {
  const { activeDeviceId, refetch } = usePlaybackState(
    useShallow((s) => ({ activeDeviceId: s.device?.id, refetch: s.refetch }))
  );

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.device.LIST],
    queryFn: () => sdk.player.getAvailableDevices()
  });

  const { mutate } = useMutation({
    mutationFn: (id: string) => {
      if (activeDeviceId === id) return Promise.resolve();
      return sdk.player.transferPlayback([id], false);
    },
    onSettled: refetch
  });

  return (
    <Screen loading={isLoading}>
      {data && data.devices.length === 0 && (
        <div className='flex size-full flex-col items-center justify-center gap-4'>
          <p className='text-fg'>No active devices found</p>
          <button className='rounded-md border-[0.125rem] border-fg p-1.5 text-sm text-fg transition-colors hover:cursor-pointer hover:bg-fg hover:text-bg'>
            Create new device
          </button>
        </div>
      )}
      {data &&
        data.devices.length > 0 &&
        data.devices.map((device) => {
          const { id, name } = device;
          if (!id) return;

          return (
            <MenuItem
              key={id}
              icon={activeDeviceId === id ? Check : false}
              onClick={() => mutate(id)}>
              {name}
            </MenuItem>
          );
        })}
    </Screen>
  );
}

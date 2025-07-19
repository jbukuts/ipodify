import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Screen from '../shared/screen';
import { sdk } from '#/lib/sdk';
import MenuItem from '../shared/menu-item';
import { Check } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { QUERY_KEYS } from '#/lib/query-enum';
import {
  useGlobalPlaybackState,
  useInvalidateGlobalPlaybackState
} from '#/lib/playback-state-context/hooks';

export default function Devices() {
  const refetch = useInvalidateGlobalPlaybackState();
  const { activeDeviceId } = useGlobalPlaybackState(
    useShallow((s) => ({ activeDeviceId: s.device?.id }))
  );

  const client = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.device.LIST],
    queryFn: () => sdk.player.getAvailableDevices()
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => {
      if (activeDeviceId === id) return Promise.resolve();
      return sdk.player.transferPlayback([id], false);
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEYS.device.LIST] });
      setTimeout(refetch, 500);
    }
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
              onClick={() => {
                if (isPending) return;
                mutate(id);
              }}>
              {name}
            </MenuItem>
          );
        })}
    </Screen>
  );
}

import { Volume, Volume1, Volume2, VolumeOff } from 'lucide-react';
import IconButton from '../shared/icon-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../shared/tooltip';
import { Slider } from '../shared/simple-slider';
import { useShallow } from 'zustand/react/shallow';
import { useMutation } from '@tanstack/react-query';
import { sdk } from '#/lib/sdk';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  useGlobalPlaybackState,
  useInvalidateGlobalPlaybackState
} from '#/lib/playback-state-context/hooks';

export default function VolumeControl() {
  const refetch = useInvalidateGlobalPlaybackState();
  const { volume, hasDevice } = useGlobalPlaybackState(
    useShallow(({ device, volume }) => ({
      volume,
      hasDevice: !!device
    }))
  );
  const [localVolume, setLocalVolume] = useState(volume);
  const isDragging = useRef(false);
  const oldVolume = useRef(50);

  useEffect(() => {
    if (!isDragging.current) setLocalVolume(volume);
  }, [volume]);

  const { mutate } = useMutation({
    mutationFn: (v: number) => {
      setLocalVolume(v);
      return sdk.player.setPlaybackVolume(v);
    },
    onSettled: () => {
      setTimeout(() => refetch(), 500);
    }
  });

  const handleMuteToggle = () => {
    if (localVolume !== 0) {
      oldVolume.current = localVolume;
      return mutate(0);
    }

    return mutate(oldVolume.current);
  };

  const Icon = useMemo(() => {
    if (localVolume === 0) return VolumeOff;
    else if (localVolume < 33) return Volume;
    else if (localVolume < 66) return Volume1;
    else return Volume2;
  }, [localVolume]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton
          disabled={!hasDevice}
          icon={Icon}
          onClick={handleMuteToggle}
        />
      </TooltipTrigger>
      {
        <TooltipContent side='top' className='px-1 py-2.5'>
          <Slider
            onPointerDown={() => (isDragging.current = true)}
            onPointerUp={() => (isDragging.current = false)}
            min={0}
            max={100}
            value={[localVolume]}
            onValueCommit={(e) => mutate(e[0])}
            onValueChange={(e) => setLocalVolume(e[0])}
            className='w-32'
          />
        </TooltipContent>
      }
    </Tooltip>
  );
}

import { useTogglePlayback } from '#/hooks/player/use-toggle-playback';
import { sdk } from '#/lib/sdk';
import { cn } from '#/lib/utils';
import { useMutation } from '@tanstack/react-query';
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  type LucideIcon
} from 'lucide-react';
import { createElement, type ComponentProps } from 'react';

function ControlButton(props: {
  icon: LucideIcon;
  size?: number;
  className?: string;
  onClick?: ComponentProps<'button'>['onClick'];
}) {
  const { icon, className, size = 24, onClick } = props;

  return (
    <button
      className={cn(
        'group relative rounded-full border-[0.0625rem] border-fg bg-bg/100 p-2 backdrop-blur-xs hover:cursor-pointer',
        className
      )}
      onClick={onClick}>
      {createElement(icon, {
        size,
        className:
          'fill-fg/75 text-fg/75 transition-["fill"] group-hover:fill-fg',
        style: { filter: 'drop-shadow( 0px 0px 0px var(--color-fg))' }
      })}
    </button>
  );
}

export default function Controls() {
  const { isPlaying, toggle } = useTogglePlayback();

  const { mutate: skip } = useMutation({
    mutationFn: async (dir: 'prev' | 'next') => {
      const fn = dir === 'prev' ? 'skipToPrevious' : 'skipToNext';
      await sdk.player[fn]('');
    }
  });

  return (
    <div className='fixed top-[calc(50%+12rem)] left-[50%] z-0 flex translate-[-50%] flex-row items-center gap-2'>
      <ControlButton icon={SkipBack} onClick={() => skip('prev')} />

      <ControlButton
        icon={isPlaying ? Pause : Play}
        size={32}
        className='p-3'
        onClick={toggle}
      />
      <ControlButton icon={SkipForward} onClick={() => skip('next')} />
    </div>
  );
}

import { cn } from '#/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

export default function IconButton(
  props: { icon: LucideIcon } & ComponentProps<'button'>
) {
  const { icon: Icon, className, ...rest } = props;

  return (
    <button
      {...rest}
      className={cn(
        'group flex shrink-0 items-center justify-center text-fg transition-opacity hover:cursor-pointer hover:opacity-80 disabled:opacity-50 hover:disabled:cursor-not-allowed',
        className
      )}>
      <Icon className='size-6 shrink-0 fill-fg' size={20} />
    </button>
  );
}

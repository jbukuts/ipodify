import { cn } from '#/lib/utils';
import type { ComponentProps } from 'react';

type BadgeButton = ComponentProps<'button'> & { isActive?: boolean };

export default function BadgeButton(props: BadgeButton) {
  const { children, className, isActive = false, ...rest } = props;

  return (
    <button
      {...rest}
      className={cn(
        'h-min rounded-full border-1 border-fg bg-bg px-1.5 py-0.25 text-xs whitespace-nowrap text-fg capitalize hover:cursor-pointer',
        isActive && 'bg-fg text-bg',
        className
      )}>
      {children}
    </button>
  );
}

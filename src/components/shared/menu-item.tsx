import { cn } from '#/lib/utils';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { forwardRef, type ComponentProps } from 'react';

type MenuItemProps = ComponentProps<'button'> &
  (
    | {
        icon?: LucideIcon | LucideIcon[] | false;
        text?: never;
      }
    | { icon?: never; text?: string }
  );

const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>((props, ref) => {
  const {
    children,
    className,
    icon: Icon = ChevronRight,
    text,
    ...rest
  } = props;

  const icons =
    Icon === false || text !== undefined
      ? null
      : (Array.isArray(Icon) ? Icon : [Icon]).map((Comp, idx) => (
          <Comp key={idx} className='size-6 shrink-0' />
        ));

  return (
    <button
      type='button'
      ref={ref}
      className={cn(
        'flex h-8 w-full flex-row items-center justify-between py-0.5 pl-2 text-left text-fg transition-colors hover:cursor-pointer hover:bg-fg hover:text-bg focus:outline-none focus-visible:bg-fg focus-visible:text-bg disabled:pointer-events-none disabled:opacity-60 data-[state=open]:bg-fg data-[state=open]:text-bg',
        className
      )}
      {...rest}>
      <p className='truncate text-nowrap'>{children}</p>
      <p className={cn('flex', text && 'pr-1 uppercase')}>{icons ?? text}</p>
    </button>
  );
});

export default MenuItem;

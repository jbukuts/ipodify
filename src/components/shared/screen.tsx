import { cn } from '#/lib/utils';
import { Loader } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';

interface ScreenProps extends React.ComponentProps<'div'> {
  loading?: boolean;
  asChild?: boolean;
}

export default function Screen(props: ScreenProps) {
  const { children, className, loading = false, asChild, ref, ...rest } = props;
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      ref={ref}
      className={cn('size-full shrink-0 overflow-x-auto pt-1', className)}
      {...rest}>
      {loading ? (
        <div className='flex size-full items-center justify-center'>
          <Loader className='size-6 animate-spin text-fg' />
        </div>
      ) : (
        children
      )}
    </Comp>
  );
}

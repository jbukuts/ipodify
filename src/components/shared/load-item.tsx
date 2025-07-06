import { forwardRef, type ComponentProps } from 'react';
import MenuItem from './menu-item';

const LoadItem = forwardRef<HTMLButtonElement, ComponentProps<typeof MenuItem>>(
  (props: ComponentProps<typeof MenuItem>, ref) => {
    return (
      <MenuItem
        ref={ref}
        {...props}
        className='pointer-events-none animate-pulse justify-center'
        icon={false}
        text={undefined}>
        ...
      </MenuItem>
    );
  }
);

export default LoadItem;

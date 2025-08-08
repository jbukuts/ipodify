import { type ComponentProps } from 'react';
import MenuItem from './menu-item';

type LoadItemProps = ComponentProps<typeof MenuItem>;

export default function LoadItem(props: LoadItemProps) {
  const { ref, ...rest } = props;

  return (
    <MenuItem
      ref={ref}
      {...rest}
      className='pointer-events-none animate-pulse justify-center'
      icon={false}
      text={undefined}>
      ...
    </MenuItem>
  );
}

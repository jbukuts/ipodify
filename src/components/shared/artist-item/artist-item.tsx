import type { ComponentProps } from 'react';
import MenuItem from '../menu-item';
import type { Artist } from '@spotify/web-api-ts-sdk';
import useAddWindow from '#/hooks/use-add-window';

type ArtistItemProps = { artist: Artist } & Omit<
  ComponentProps<typeof MenuItem>,
  'onClick'
>;

export default function ArtistItem(props: ArtistItemProps) {
  const { artist, ...rest } = props;
  const { name, id } = artist;

  const goTo = useAddWindow();

  return (
    <MenuItem {...rest} text={undefined} onClick={goTo(name, 'Artist', { id })}>
      {name}
    </MenuItem>
  );
}

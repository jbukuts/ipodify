import usePalette from '#/hooks/usePalette';
import usePlaybackState from '#/lib/store/now-playing';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import generateBlobPath from 'useless-blobs';
import { cn } from '#/lib/utils';

const PATHS = Array.from({ length: 27 }, () =>
  generateBlobPath({
    width: 1000,
    height: 1000,
    verts: 42,
    irregularity: 0.5,
    spikiness: 0.8,
    boundingShape: 'ellipsis',
    smoothing: 1
  })
);

export default function Blobs() {
  const { images } = usePlaybackState(
    useShallow(({ item, isPlaying }) => ({
      images: item && 'album' in item ? item.album.images : null,
      isPlaying
    }))
  );

  const palette = usePalette(images ? images[0].url : undefined);

  useEffect(() => {
    if (palette.length < 1) return;
    const color = palette[0];
    document.body.style.backgroundColor = `rgb(${color.join(',')})`;

    const credit = document.getElementById('credit');
    if (!credit) return;
    credit.style.color = `rgb(${color.map((val) => 255 - val).join(',')})`;
  }, [palette]);

  return (
    <svg
      className={cn(
        'fixed top-[50%] left-[50%] size-[45rem] translate-[-50%] transition-all duration-500 will-change-contents'
        // 'animate-spin duration-100000'
        // !isPlaying && 'scale-65'
        // idx % 2 === 0 && 'direction-reverse'
      )}
      imageRendering={'optimize-speed'}
      viewBox={`0 0 ${1000} ${1000}`}
      width={1000}
      height={1000}
      xmlns='http://www.w3.org/2000/svg'
      overflow='visible'>
      <defs>
        <filter
          id='dither'
          colorInterpolationFilters='sRGB'
          x='0'
          y='0'
          width='100%'
          height='100%'>
          <feImage
            width='4'
            height='4'
            xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA+UlEQVR42gXBERTCUABA0X/OYDAYDAZBEAyCIBgMgiAIgiAYBINgEAwGgyAIBsFgMAiCIAiCIAgGQTAYDAaDIAiCwWDwulcIIXg8HgwGA36/H4qi8Hq9sCyLtm0Rm82G0WjE5XJhvV4ThiHT6ZT7/U4QBIhut0tVVaiqSpZl9Pt9vt8vnU6HsiwRh8OB5XLJfr9nNptxPp9xXZckSbBtGyHLMs/nE9M0aZoGSZJI05ThcEhd14jdbsdkMuF2u+H7PtvtlvF4zPV6xfM8hGEYfD4fdF2nKAp6vR7v9xtN08jzHHE6nVitVsRxzGKx4Hg84jgOURQxn8/5A7oKnYRU4EpfAAAAAElFTkSuQmCC'
          />
          <feTile />
          <feComposite
            operator='arithmetic'
            k1='0'
            k2='1'
            k3='1'
            k4='-0.5'
            in='SourceGraphic'
          />
          <feComponentTransfer>
            <feFuncR type='discrete' tableValues='0 1' />
            <feFuncG type='discrete' tableValues='0 1' />
            <feFuncB type='discrete' tableValues='0 1' />
          </feComponentTransfer>
        </filter>
        <filter id='blur'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='77' />
        </filter>
      </defs>

      <g filter='url(#blur)' className={cn('transition-all')}>
        {palette.slice(1).map((c, idx) => (
          <path
            className='transition-all'
            style={{ fill: `rgba(${c.join(',')}, 1)` }}
            fillOpacity={0.0875}
            width={1000}
            height={1000}
            key={idx}
            d={PATHS[idx]}
          />
        ))}
      </g>
    </svg>
  );
}

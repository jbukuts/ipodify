/// <reference types="vite-plugin-glsl/ext" />

import usePalette from '#/hooks/usePalette';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useWindowSize } from 'usehooks-ts';
import plasmaFragShaderSource from './shaders/plasma.frag';
// import ditherSource from './shaders/dither.frag';
// import ditherSource from './shaders/random-dither.frag';
import paletteFragShaderSource from './shaders/palette.frag';
import lcdFragShaderSource from './shaders/lcd.frag';
import SimplePipeline from './pipeline';
import { calcLum, lerp } from './helpers';
import { useGlobalPlaybackState } from '#/lib/playback-state-context/hooks';

const PIPELINE_CONFIG = {
  plasma: {
    src: plasmaFragShaderSource,
    locs: {
      u_time: 'uniform1f',
      u_speed: 'uniform1f',
      u_zoom: 'uniform1f'
    }
  },
  // dither: {
  //   src: ditherSource,
  //   locs: { u_resolution: 'uniform2f', u_texture: 'uniform1i' }
  // },
  palette: {
    src: paletteFragShaderSource,
    locs: { u_texture: 'uniform1i', u_palette: 'uniform3fv' }
  },
  lcd: {
    src: lcdFragShaderSource,
    locs: { u_texture: 'uniform1i', u_resolution: 'uniform2f' }
  }
} as const;

const START_PALETTE: [number, number, number][] = [
  [0, 0, 0],
  [0.2, 0.2, 0.2],
  [0.5, 0.5, 0.5],
  [1, 1, 1]
];

function useAlbumPalette() {
  const images = useGlobalPlaybackState(
    useShallow(({ item }) =>
      item && 'album' in item ? item.album.images : null
    )
  );

  const palette = usePalette(images ? images[0].url : undefined);
  return palette;
}

export default function Blobs() {
  const ref = useRef<HTMLCanvasElement>(null);
  const size = useWindowSize();
  const albumPalette = useAlbumPalette();
  const palette = useRef(START_PALETTE.flat());
  const zoom = useRef(0.75);
  const speed = useRef(0.15);

  const pipeline = useRef<SimplePipeline<typeof PIPELINE_CONFIG>>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const renderPipline = new SimplePipeline(
      gl,
      canvas.width,
      canvas.height,
      PIPELINE_CONFIG
    );

    pipeline.current = renderPipline;

    const render = (time: number) => {
      time *= 0.001;

      renderPipline.render({
        plasma: {
          u_time: time,
          u_speed: speed.current,
          u_zoom: zoom.current
        },
        dither: {
          u_resolution: [canvas.width, canvas.height],
          u_texture: 0
        },
        palette: {
          u_texture: 0,
          u_palette: new Float32Array(palette.current)
        },
        lcd: {
          u_texture: 0,
          u_resolution: [canvas.width, canvas.height]
        }
      });

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    let p = albumPalette;
    if (Array.isArray(p) && p.length < 4) return;
    if (p === null)
      p = START_PALETTE.map(([r, g, b]) => [r * 255, g * 255, b * 255]);

    const start = palette.current;
    const end = p
      .slice(0, 4)
      .toSorted((a, b) => calcLum(...a) - calcLum(...b))
      .map(([r, g, b]) => [r / 255, g / 255, b / 255])
      .flat();

    let startTime: number;
    const handleTransition = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / 500, 1);

      palette.current = end.map((v, idx) => lerp(start[idx], v, t));

      if (t < 1) requestAnimationFrame(handleTransition);
      else {
        palette.current = end;
      }
    };

    requestAnimationFrame(handleTransition);
  }, [albumPalette]);

  useEffect(() => {
    if (!pipeline.current) return;
    pipeline.current.updateDimensions(size.width, size.height);
  }, [size]);

  return (
    <canvas
      ref={ref}
      width={size.width}
      height={size.height}
      className='fixed top-0 left-0 -z-1 h-screen w-screen'
    />
  );
}

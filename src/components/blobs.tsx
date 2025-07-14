import usePalette from '#/hooks/usePalette';
import usePlaybackStateStore from '#/lib/store/playback-state-store';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useWindowSize } from 'usehooks-ts';

const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t;
};

const START_PALETTE = [
  [0, 0, 0],
  [0.2, 0.2, 0.2],
  [0.5, 0.5, 0.5],
  [1, 1, 1]
].flat();

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const plasmafragmentShaderSource = `
precision mediump float;

uniform float u_time;
uniform float u_speed;
uniform float u_zoom;
varying vec2 v_uv;

// More chaotic plasma function
float plasma(vec2 p, float t) {
float v = 0.0;
v += sin(p.x * 3.0 + t * 1.0);
v += sin(p.y * 4.0 + t * 1.3);
v += sin((p.x + p.y) * 2.0 + t * 0.7);
v += sin(length(p) * 4.0 - t * 1.5);
v += sin(dot(p, vec2(sin(t), cos(t))) * 5.0);
return v / 5.0;
}

void main() {
    vec2 uv = v_uv * 2.0 - 1.0;
    uv *= u_zoom; // zoom
    float t = u_time * u_speed; // control speed
    float v = plasma(uv, t);
    v = 0.5 + 0.5 * sin(v * 3.0 + t);
    gl_FragColor = vec4(vec3(v), 1.0); // grayscale output
}`;

const ditherFragmentShaderSource = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
varying vec2 v_uv;

float getBayerThreshold(int x, int y) {
    int index = y * 4 + x;
    if (index ==  0) return  0.0 / 16.0;
    if (index ==  1) return  8.0 / 16.0;
    if (index ==  2) return  2.0 / 16.0;
    if (index ==  3) return 10.0 / 16.0;
    if (index ==  4) return 12.0 / 16.0;
    if (index ==  5) return  4.0 / 16.0;
    if (index ==  6) return 14.0 / 16.0;
    if (index ==  7) return  6.0 / 16.0;
    if (index ==  8) return  3.0 / 16.0;
    if (index ==  9) return 11.0 / 16.0;
    if (index == 10) return  1.0 / 16.0;
    if (index == 11) return  9.0 / 16.0;
    if (index == 12) return 15.0 / 16.0;
    if (index == 13) return  7.0 / 16.0;
    if (index == 14) return 13.0 / 16.0;
    return 5.0 / 16.0;
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    int x = int(mod(fragCoord.x, 4.0));
    int y = int(mod(fragCoord.y, 4.0));
    
    float threshold = getBayerThreshold(x, y);
    float gray = texture2D(u_texture, v_uv).r;

    float dithered = gray < threshold ? 0.0 : 1.0;

    gl_FragColor = vec4(vec3(dithered), 1.0);
}`;

const betterPaletteShaderSource = `
  #define PALETTE_SIZE 4
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_texture;
  uniform vec3 u_palette[PALETTE_SIZE];

  // accessing array via int not supported?!?!
  vec3 getColor(int index) {
    if (index == 0) return u_palette[0];
    if (index == 1) return u_palette[1];
    if (index == 2) return u_palette[2];
    return u_palette[3];
  }

  void main() {
    float t = texture2D(u_texture, v_uv).r;
    float scaled = t * float(PALETTE_SIZE - 1);
    int idx = int(floor(scaled));

    // min function not support?!?!?
    int next = idx + 1;
    if (next >= PALETTE_SIZE) {
      next = PALETTE_SIZE - 1;
    }

    float f = fract(scaled);

    vec3 col_a = getColor(idx);
    vec3 col_b = getColor(next);
    vec3 color = mix(col_a, col_b, f);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function useAlbumPalette() {
  const { images } = usePlaybackStateStore(
    useShallow(({ item, isPlaying }) => ({
      images: item && 'album' in item ? item.album.images : null,
      isPlaying
    }))
  );

  const palette = usePalette(images ? images[0].url : undefined);

  return palette;
}

export default function Test() {
  const ref = useRef<HTMLCanvasElement>(null);
  const size = useWindowSize();
  const albumPalette = useAlbumPalette();
  const palette = useRef(START_PALETTE);
  const zoom = useRef(0.5);
  const speed = useRef(0.1);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const compileShader = (type: GLenum, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Could not create shader');
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const createProgram = (vertexSrc: string, fragmentSrc: string) => {
      const v = compileShader(gl.VERTEX_SHADER, vertexSrc);
      const f = compileShader(gl.FRAGMENT_SHADER, fragmentSrc);
      const program = gl.createProgram();
      gl.attachShader(program, v);
      gl.attachShader(program, f);
      gl.linkProgram(program);
      return program;
    };

    const createRenderTarget = (width: number, height: number) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        width,
        height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        tex,
        0
      );

      return { framebuffer: fb, texture: tex };
    };

    const plasmaProgram = createProgram(
      vertexShaderSource,
      plasmafragmentShaderSource
    );
    const ditherProgram = createProgram(
      vertexShaderSource,
      ditherFragmentShaderSource
    );
    const paletteProgram = createProgram(
      vertexShaderSource,
      betterPaletteShaderSource
    );

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const plasmaLocs = {
      a_position: gl.getAttribLocation(plasmaProgram, 'a_position'),
      u_time: gl.getUniformLocation(plasmaProgram, 'u_time'),
      u_speed: gl.getUniformLocation(plasmaProgram, 'u_speed'),
      u_zoom: gl.getUniformLocation(plasmaProgram, 'u_zoom')
    };

    const ditherLoc = {
      a_position: gl.getAttribLocation(ditherProgram, 'a_position'),
      u_resolution: gl.getUniformLocation(ditherProgram, 'u_resolution'),
      u_texture: gl.getUniformLocation(ditherProgram, 'u_texture')
    };

    const paletteLocs = {
      a_position: gl.getAttribLocation(paletteProgram, 'a_position'),
      u_texture: gl.getUniformLocation(paletteProgram, 'u_texture'),
      u_palette: gl.getUniformLocation(paletteProgram, 'u_palette')
    };

    const renderTarget = createRenderTarget(canvas.width, canvas.height);
    const r2 = createRenderTarget(canvas.width, canvas.height);

    const render = (time: number) => {
      time *= 0.001;

      gl.viewport(0, 0, canvas.width, canvas.height);

      // Pass 1: Plasma → offscreen
      gl.bindFramebuffer(gl.FRAMEBUFFER, renderTarget.framebuffer);
      gl.useProgram(plasmaProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.enableVertexAttribArray(plasmaLocs.a_position);
      gl.vertexAttribPointer(plasmaLocs.a_position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(plasmaLocs.u_time, time);
      gl.uniform1f(plasmaLocs.u_speed, speed.current); // control speed
      gl.uniform1f(plasmaLocs.u_zoom, zoom.current);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      //dither
      gl.bindFramebuffer(gl.FRAMEBUFFER, r2.framebuffer);
      gl.useProgram(ditherProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.enableVertexAttribArray(ditherLoc.a_position);
      gl.vertexAttribPointer(ditherLoc.a_position, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, renderTarget.texture);
      gl.uniform1i(ditherLoc.u_texture, 0);
      gl.uniform2f(ditherLoc.u_resolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Pass 2: Palette → screen
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.useProgram(paletteProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.enableVertexAttribArray(paletteLocs.a_position);
      gl.vertexAttribPointer(paletteLocs.a_position, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, r2.texture);
      gl.uniform1i(paletteLocs.u_texture, 0);
      gl.uniform3fv(paletteLocs.u_palette, new Float32Array(palette.current));
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }, [palette]);

  useEffect(() => {
    if (albumPalette.length < 4) return;

    const start = palette.current;
    const end = albumPalette
      .slice(0, 4)
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

  return (
    <canvas
      ref={ref}
      width={size.width}
      height={size.height}
      className='fixed top-0 left-0 -z-1 h-screen w-screen'
    />
  );
}

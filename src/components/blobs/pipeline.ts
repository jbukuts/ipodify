import vertShaderSource from './shaders/simple.vert';

type RenderContext = WebGL2RenderingContext | WebGL2RenderingContext;

type LocFn = 'uniform1i' | 'uniform3fv' | 'uniform2f' | 'uniform1f';

type LocMap = { a_position: number } & Record<
  string,
  { loc: WebGLUniformLocation | null; fn: LocFn }
>;

export type Config = {
  [name: string]: {
    src: string;
    locs: {
      [key: string]: LocFn;
    };
  };
};

type InternalConfig = {
  [name: string]: {
    program: WebGLProgram;
    locs: LocMap;
  };
};

/**
 * Small little helper class for multipass shader pipeline
 *
 * Not perfect but it does the trick for experimenting
 */
export default class SimplePipeline<T extends Config> {
  #gl: RenderContext;
  #dim: [number, number];
  #pos_buffer: WebGLBuffer;

  #internal: InternalConfig;
  #rts: ReturnType<typeof this.createRenderTarget>[] = [];

  constructor(gl: RenderContext, w: number, h: number, conf: T) {
    this.#gl = gl;
    this.#dim = [w, h];

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    this.#pos_buffer = posBuffer;

    this.#internal = Object.entries(conf).reduce((acc, curr) => {
      const [name, { locs, src }] = curr;

      const program = this.createProgram(vertShaderSource, src);
      acc[name] = {
        program,
        locs: Object.entries(locs).reduce(
          (acc, [key, val]) => {
            acc[key] = {
              loc: gl.getUniformLocation(program, key),
              fn: val
            };

            return acc;
          },
          { a_position: gl.getAttribLocation(program, 'a_position') } as LocMap
        )
      };

      return acc;
    }, {} as InternalConfig);

    this.#rts = Object.keys(this.#internal)
      .slice(0, -1)
      .map(() => {
        return this.createRenderTarget(w, h);
      });
  }

  private compileShader(type: GLenum, source: string) {
    const shader = this.#gl.createShader(type);
    if (!shader) throw new Error('Could not create shader');
    this.#gl.shaderSource(shader, source);
    this.#gl.compileShader(shader);
    return shader;
  }

  private createProgram(vertexSrc: string, fragmentSrc: string) {
    const gl = this.#gl;
    const v = this.compileShader(gl.VERTEX_SHADER, vertexSrc);
    const f = this.compileShader(gl.FRAGMENT_SHADER, fragmentSrc);
    const program = gl.createProgram();
    gl.attachShader(program, v);
    gl.attachShader(program, f);
    gl.linkProgram(program);
    return program;
  }

  private createRenderTarget(width: number, height: number) {
    const gl = this.#gl;

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
  }

  updateDimensions(w: number, h: number) {
    this.#dim = [w, h];
    this.#rts = this.#rts.map(() => this.createRenderTarget(w, h));
  }

  render(
    v: Record<
      keyof T | string,
      Record<keyof T[string]['locs'], unknown | unknown[]>
    >
  ) {
    const gl = this.#gl;
    const [w, h] = this.#dim;

    gl.viewport(0, 0, w, h);
    Object.keys(this.#internal).forEach((key, idx) => {
      const rt = this.#rts[idx];
      const item = this.#internal[key];
      const { locs, program } = item;
      const inputs = v[key];

      gl.bindFramebuffer(gl.FRAMEBUFFER, rt ? rt.framebuffer : null);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.#pos_buffer);
      gl.enableVertexAttribArray(locs.a_position);
      gl.vertexAttribPointer(locs.a_position, 2, gl.FLOAT, false, 0, 0);

      // subsequent passes should act upon the previous output
      if (idx > 0) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.#rts[idx - 1].texture);
      }

      // apply custom input values
      Object.keys(inputs).forEach((key) => {
        if (!(key in locs)) return;
        const { loc, fn } = locs[key];
        const v = inputs[key];
        const a = Array.isArray(v) ? v : [v];
        // @ts-expect-error spreading value into unknown fn, have faith
        gl[fn](loc, ...a);
      });

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    });
  }
}

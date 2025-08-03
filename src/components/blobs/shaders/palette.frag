
#define PALETTE_SIZE 5
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

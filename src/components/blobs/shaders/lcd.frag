precision mediump float;

varying vec2 v_uv;
uniform sampler2D u_texture;
uniform vec2 u_resolution;

float SIZE = 7.0;

vec4 h_color(int n) {
  int c = int(3 * n / int(SIZE - 1.0));

  if (c == 0) return vec4(1.0, 1.0, 1.0, 0.6);
  if (c == 1) return vec4(1.0, 1.0, 1.0, 0.4);
  return vec4(1.0, 1.0, 1.0, 0.2);
}

vec4 v_color(int n) {
  int c = int(3 * n / int(SIZE - 1.0));

  if (c == 0) return vec4(1.0, 0.0, 0.0, 1.0);
  if (c == 1) return vec4(0.0, 1.0, 0.0, 1.0);
  return vec4(0.0, 0.0, 1.0, 1.0);
}


void main() {
  vec2 texCoord = v_uv;
  vec2 pixelCoord = v_uv * u_resolution;

  vec4 base_color = texture2D(u_texture, texCoord);
  
  int x = int(mod(pixelCoord.x, SIZE));
  int y = int(mod(pixelCoord.y, SIZE));

  vec4 h_c = h_color(y);
  vec4 v_c = v_color(x);
  vec4 mixed = mix(h_c, v_c, 0.85);

  vec4 effect_color = mixed.rgba * base_color.rgba;
  vec4 final_color = mix(base_color, effect_color, 0.2);
  // final_color.a = 1.0;
  gl_FragColor = final_color;
}

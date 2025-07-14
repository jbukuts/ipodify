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

    vec3 dithered = vec3(gray < threshold ? 0.0 : 1.0);
    // vec3 color = mix(vec3(gray), dithered, 0.8);
    
    gl_FragColor = vec4(dithered, 1.0);
}

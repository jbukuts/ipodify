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
}

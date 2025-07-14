precision mediump float;

uniform sampler2D u_texture;  // input grayscale image
uniform vec2 u_resolution;  // resolution of the image
// uniform float u_time;    time for animated randomness (optional)

varying vec2 v_uv;

// Simple pseudo-random generator based on coordinates
float random(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec2 uv = v_uv;

    // Sample the grayscale value
    float gray = texture2D(u_texture, uv).r;

    // Generate random noise based on position and time (optional animation)
    float noise = random(uv);

    // Dithering: Threshold gray using random noise
    float dithered = step(noise, gray);
    if (gray == 1.0 || gray == 0.0) {
        dithered = gray;
    } 

    // Output as grayscale
    gl_FragColor = vec4(vec3(dithered), 1.0);
}

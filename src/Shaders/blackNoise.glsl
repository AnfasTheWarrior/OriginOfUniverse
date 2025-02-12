precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

float noise(vec2 uv) {
    return fract(sin(dot(uv * vec2(12.9898, 78.233), vec2(12.9898, 78.233))) * 43758.5453);
}

void //main() { 
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // Generate noise
    float noiseValue = noise(uv * 15.0); // Increase scale for more dense dots

    // Set threshold for black dots
    float threshold = 0.2; // Lower = fewer dots, higher = more dots

    // Create the black dot effect
    float dotMask = step(noiseValue, threshold); // 1.0 where dots appear, 0.0 elsewhere
    vec3 color = vec3(0.0); // Pure black for dots

    // Apply transparency (only dots visible, background is fully transparent)
    gl_FragColor = vec4(color, dotMask); 
}

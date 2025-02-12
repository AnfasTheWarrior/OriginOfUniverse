import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "glslify";

const BackgroundShader = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uProgress: 0,
    texture1: null,
    resolution: [0, 0, 0, 0],
  },
  // Vertex Shader
  glsl`
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vPosition = position;  // Pass vPosition to fragment shader
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  glsl`
    precision mediump float;

    varying vec2 vUv;
    varying vec3 vPosition;

    uniform float uTime;  
    uniform float uProgress;
    uniform sampler2D texture1;
    uniform vec4 resolution;

    // Noise functions
    float mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 perm(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }

    float noise(vec3 p) {
        vec3 a = floor(p);
        vec3 d = p - a;
        d = d * d * (3.0 - 2.0 * d);

        vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
        vec4 k1 = perm(b.xyxy);
        vec4 k2 = perm(k1.xyxy + b.zzww);

        vec4 c = k2 + a.zzzz;
        vec4 k3 = perm(c);
        vec4 k4 = perm(c + 1.0);

        vec4 o1 = fract(k3 * (1.0 / 41.0));
        vec4 o2 = fract(k4 * (1.0 / 41.0));

        vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
        vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

        return o4.y * d.y + o4.x * (1.0 - d.y);
    }

    // Lines function
    float lines(vec2 uv, float offset) {
        return smoothstep(
            0.0, 0.49 + offset * 0.001,
            abs(0.5 * sin(uv.x * 40.0) + offset * 2.0)
        );
    }

    // Rotate UV coordinates
    mat2 rotate2D(float angle) {
        return mat2(
            cos(angle), -sin(angle),
            sin(angle), cos(angle)
        );
    }

    void main() {
        // Applying noise for movement
        float n = noise(vPosition * 1.2 + uTime / 1.00);

        // vec3 color1 = vec3(0.88, 0.58, 0.26); // Warm, golden orange
        // vec3 color2 = vec3(0.05, 0.05, 0.05);  // Very dark gray, almost black
        // vec3 color3 = vec3(0.45, 0.60, 0.45); // Slightly lighter green

        // vec3 color1 = vec3(0.88, 0.58, 0.26); // Color 1
    // vec3 color2 = vec3(0.0, 0.0, 0.0); // Color 2 (black)
    // vec3 color3 = vec3(0.47, 0.62, 0.47); // Color 3

    vec3 color1 =  vec3(0,0,1.26);
    vec3 color2 =  vec3(0.0, 0.0, 0.0);
    vec3 color3 =  vec3(1.2,0.2,1.2);

        // Rotating UV coordinates and applying patterns
        vec2 baseUV = rotate2D(n) * vPosition.xy * 0.085;
        float basePattern = lines(baseUV, 0.15);
        float secondPattern = lines(baseUV, 0.05);

        // Mixing colors based on patterns
        vec3 baseColor = mix(color3, color1, basePattern);
        vec3 secondBaseColor = mix(baseColor, color2, secondPattern);

        // Setting final color without white noise
        gl_FragColor = vec4(secondBaseColor, 1.0); 
    }
  `
);

extend({ BackgroundShader });

export default BackgroundShader;

// SphereShader.js
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "glslify";

const SphereShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uCube: null,
    uRefractionIndex: 1.0, // Refraction index for lens effect
  },
  // Vertex Shader
  glsl`
    precision mediump float;
    varying vec3 vReflect;
    varying vec3 vRefract;

    uniform float uRefractionIndex;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
      vec3 I = normalize((modelMatrix * vec4(position, 0.0)).xyz - cameraPosition);

      // Reflection vector
      vReflect = reflect(I, worldNormal);
      
      // Refraction vector
      vRefract = refract(I, worldNormal, uRefractionIndex);

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  glsl`
    precision mediump float;

    uniform samplerCube uCube;
    varying vec3 vReflect;
    varying vec3 vRefract;

    void main() {
      // Sampling the cube texture using the refraction vector to simulate lens distortion
      vec4 refractedColor = textureCube(uCube, vRefract);
      vec4 reflectedColor = textureCube(uCube, vReflect);

      // Combine the refracted and reflected colors
      vec4 finalColor = mix(reflectedColor, refractedColor, 0.5); // Adjust blend factor as needed

      gl_FragColor = finalColor;
    }
  `
);

extend({ SphereShaderMaterial });

export default SphereShaderMaterial;

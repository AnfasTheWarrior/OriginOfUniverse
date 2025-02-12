import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import blackNoiseShader from '../Shaders/blackNoise.glsl'; // Import the GLSL shader

const BlackNoiseOverlay = () => {
  const canvasRef = useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2, width / 2,
      height / 2, height / -2,
      1, 10
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(width, height);

    const geometry = new THREE.PlaneGeometry(width, height);

    // Create shader material with error checking
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const fragmentShader = blackNoiseShader;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_resolution: { value: new THREE.Vector2(width, height) },
        u_time: { value: 0.0 }
      },
      transparent: true
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const animate = () => {
      requestAnimationFrame(animate);
      material.uniforms.u_time.value += 0.01; // Update time uniform
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, [width, height]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />;
};

export default BlackNoiseOverlay;

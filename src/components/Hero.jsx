import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CubeCamera } from 'three';
import BackgroundShader from '../Shaders/BackgroundShader';
import SphereShaderMaterial from '../Shaders/SphereShader';
import BlackNoiseOverlay from './BlackNoiseOverlay'; // Import the overlay component
import "../App.css";
import gsap from 'gsap';
import "../../modified/main.css";
import "../../modified/style.css";

const Hero = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(0, 0, 1);
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(sizes.width, sizes.height);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;

    // Cube Camera
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512, {
      format: THREE.RGBFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
    });
    const cubeCamera = new CubeCamera(0.1, 100, cubeRenderTarget);
    scene.add(cubeCamera);

    // Sphere with reflective material
    const sphereGeometry = new THREE.SphereGeometry(0.44, 64, 64);
    const sphereMaterial = new SphereShaderMaterial({ uCube: cubeRenderTarget.texture });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphereMesh);

    // Background sphere with custom shader
    const backgroundGeometry = new THREE.SphereGeometry(2.5, 100, 100);
    const backgroundMaterial = new BackgroundShader({ side: THREE.BackSide });
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    scene.add(backgroundMesh);

    // Initial xAxis position
    let xAxis = 0.340;
    sphereMesh.position.set(xAxis, 0.24, 0.22);

    const minValue = 0.20;
    const maxValue = 0.348;

    // Function to map a value from one range to another
    function mapRange(value, inMin, inMax, outMin, outMax) {
      return outMin + ((value - inMin) / (inMax - inMin) * (outMax - outMin));
    }

    // Track mouse movement continuously
    const handleMouseMove = (e) => {
      const pageX = e.pageX;
      const viewportWidth = window.innerWidth;

      // Map pageX to a value between 0.0 and 1.0
      const normalizedX = mapRange(pageX, 0, viewportWidth, 0, 1);

      // Map normalizedX to the desired range (0.20 to 0.30) - reversed logic
      const mappedValue = mapRange(normalizedX, 0, 1, maxValue, minValue);

      // Use GSAP to animate the xAxis value smoothly
      gsap.to(sphereMesh.position, {
        duration: 0.5,
        x: mappedValue,
        ease: "power1.In",
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Handle window resize
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);

      // Update time for shaders
      const elapsedTime = clock.getElapsedTime();
      if (backgroundMaterial.uniforms && backgroundMaterial.uniforms.uTime) {
        backgroundMaterial.uniforms.uTime.value = elapsedTime;
      }

      sphereMesh.visible = false;
      cubeCamera.update(renderer, scene);
      sphereMesh.visible = true;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return (
    <div className='hero'>
    <div class="head">
    <div class="banner">
      <div class="h-bg8"></div>
      <div class="over-b"></div>
    </div>
    <span class="t-hs"><i>S</i>IN<i>G</i>ULA<i>RI</i>TY</span>
    <div class="h-nav">
      <span class="h-nav-links"><a href="#nv">MAGAZINE MENU</a>
        <a href="#INTRO-TEXT">INTRO TEXT</a>
        <a href="#VISION">VISION</a></span>
    </div>
  </div>
      <canvas ref={canvasRef} id="glslCanvas"></canvas>
      <BlackNoiseOverlay /> {/* Add the GLSL noise effect overlay */}
    </div>
  );
};

export default Hero;

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function RippleImage() {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = 340;
    const height = 340;

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    mountRef.current.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();

    const texture1 = loader.load("/dark.png");
    texture1.minFilter = THREE.LinearFilter;
    texture1.magFilter = THREE.LinearFilter;

    const texture2 = loader.load("/cosmos.png");
    texture2.minFilter = THREE.LinearFilter;
    texture2.magFilter = THREE.LinearFilter;

    const displacement = loader.load("/ripple.jpg");
    displacement.minFilter = THREE.LinearFilter;
    displacement.magFilter = THREE.LinearFilter;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        texture1: { value: texture1 },
        texture2: { value: texture2 },
        disp: { value: displacement },
        dispFactor: { value: 0 },
      },

      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,

      fragmentShader: `
        varying vec2 vUv;

        uniform sampler2D texture1;
        uniform sampler2D texture2;
        uniform sampler2D disp;

        uniform float dispFactor;

        void main() {

          vec2 uv = vUv;

          vec4 dispTex = texture2D(disp, uv);

          vec2 distorted1 = vec2(
            uv.x + dispFactor * (dispTex.r * 0.2),
            uv.y
          );

          vec2 distorted2 = vec2(
            uv.x - (1.0 - dispFactor) * (dispTex.r * 0.2),
            uv.y
          );

          vec4 tex1 = texture2D(texture1, distorted1);
          vec4 tex2 = texture2D(texture2, distorted2);

          gl_FragColor = mix(tex1, tex2, dispFactor);
        }
      `,
    });

    // Higher segments = smoother ripple
    const geometry = new THREE.PlaneGeometry(2, 2, 64, 64);

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let hover = false;

    const handleEnter = () => (hover = true);
    const handleLeave = () => (hover = false);

    mountRef.current.addEventListener("mouseenter", handleEnter);
    mountRef.current.addEventListener("mouseleave", handleLeave);

    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (hover) {
        material.uniforms.dispFactor.value += 0.03;
      } else {
        material.uniforms.dispFactor.value -= 0.03;
      }

      material.uniforms.dispFactor.value = Math.max(
        0,
        Math.min(1, material.uniforms.dispFactor.value)
      );

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      mountRef.current.removeEventListener("mouseenter", handleEnter);
      mountRef.current.removeEventListener("mouseleave", handleLeave);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: 340,
        height: 340,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid rgba(123,140,222,0.3)",
        position: "relative",
        zIndex: 1,
      }}
    />
  );
}
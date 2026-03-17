"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScrollProgress } from "@/components/hooks/useScrollprogress";

export default function ParticleField({ count = 4000 }) {
  const mesh = useRef(null);
  const scroll = useScrollProgress();

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22;

      const isOrange = Math.random() > 0.85;
      colors[i * 3] = isOrange ? 0.965 : 0.44;
      colors[i * 3 + 1] = isOrange ? 0.51 : 0.44;
      colors[i * 3 + 2] = isOrange ? 0.122 : 0.44;
    }

    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    const t = state.clock.elapsedTime;
    mesh.current.rotation.y = t * 0.025;
    mesh.current.rotation.x = t * 0.01;

    state.camera.position.y = -scroll * 3;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.025}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}
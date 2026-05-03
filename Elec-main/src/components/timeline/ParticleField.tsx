import { useMemo, useRef } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import * as THREE from "three";

export function ParticleGeometry({ dim = 1 }: { dim?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const count = 500;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30; // x
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30; // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30; // z
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const index = i * 3 + 1;
        // Float particles up and down
        positionsAttr.array[index] += Math.sin(state.clock.elapsedTime * 0.3 + i * 0.01) * 0.002;
      }
      positionsAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="white" size={0.05} transparent opacity={dim * 0.6} sizeAttenuation />
    </points>
  );
}

export default function ParticleField({ dim = 1 }: { dim?: number }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ParticleGeometry dim={dim} />
      </Canvas>
    </div>
  );
}

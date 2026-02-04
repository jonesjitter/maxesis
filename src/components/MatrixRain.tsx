'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function MatrixColumns() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const numColumns = 60;
  const numRows = 30;
  const totalChars = numColumns * numRows;

  const { dummy, offsets, speeds } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const offsets = new Float32Array(totalChars);
    const speeds = new Float32Array(totalChars);

    for (let i = 0; i < totalChars; i++) {
      offsets[i] = Math.random() * 100;
      speeds[i] = 0.5 + Math.random() * 2;
    }

    return { dummy, offsets, speeds };
  }, [totalChars]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    let idx = 0;

    for (let col = 0; col < numColumns; col++) {
      for (let row = 0; row < numRows; row++) {
        const x = (col - numColumns / 2) * 0.4;
        const baseY = (row - numRows / 2) * 0.5;
        const y = baseY - ((time * speeds[idx] + offsets[idx]) % 20);

        dummy.position.set(x, y, 0);
        dummy.scale.setScalar(0.15 + Math.random() * 0.1);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(idx, dummy.matrix);

        const brightness = Math.max(0, 1 - (Math.abs(y) / 10));
        const color = new THREE.Color();
        color.setHSL(0.35, 1, brightness * 0.5);
        meshRef.current.setColorAt(idx, color);

        idx++;
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, totalChars]}>
      <planeGeometry args={[0.3, 0.5]} />
      <meshBasicMaterial transparent opacity={0.8} />
    </instancedMesh>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00ff88"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function MatrixRain() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden" style={{ width: 'calc(100vw + 20px)', marginRight: '-20px' }}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 10, 30]} />
        <MatrixColumns />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}

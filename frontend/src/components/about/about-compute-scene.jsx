/* eslint-disable react/no-unknown-property */
import { Component, Suspense, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ABOUT_MODEL_PATH = '/media/about_page.glb';

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function createStarPositions() {
  const random = seededRandom(117);
  const positions = new Float32Array(270 * 3);

  for (let index = 0; index < positions.length; index += 3) {
    positions[index] = (random() - 0.5) * 22;
    positions[index + 1] = (random() - 0.5) * 14;
    positions[index + 2] = -2 - random() * 8;
  }

  return positions;
}

const STAR_POSITIONS = createStarPositions();
const FIN_POSITIONS = Array.from({ length: 18 }, (_, index) => -1.8 + index * 0.212);
const TRACE_ROWS = [-0.92, -0.62, 0.62, 0.92];
const NODE_POSITIONS = [
  [-4.4, 2.1, -1.4],
  [4.2, 2.6, -2.2],
  [-4.8, -2.5, -1.8],
  [4.9, -1.9, -2.8],
  [0.4, 3.7, -3.2],
];

function ComputeObject({ progressRef }) {
  const assemblyRef = useRef(null);
  const coreRef = useRef(null);
  const ringRef = useRef(null);

  useFrame(({ clock, camera }, delta) => {
    const progress = progressRef.current;
    const targetX = Math.sin(progress * Math.PI * 3.1) * 1.45;
    const targetY = 0.12 + Math.sin(progress * Math.PI * 2) * 0.42;
    const targetScale = 0.82 + Math.sin(progress * Math.PI) * 0.46;

    assemblyRef.current.position.x = THREE.MathUtils.damp(
      assemblyRef.current.position.x,
      targetX,
      3.8,
      delta
    );
    assemblyRef.current.position.y = THREE.MathUtils.damp(
      assemblyRef.current.position.y,
      targetY,
      3.8,
      delta
    );
    assemblyRef.current.rotation.x = THREE.MathUtils.damp(
      assemblyRef.current.rotation.x,
      -0.42 + progress * 0.55,
      3.4,
      delta
    );
    assemblyRef.current.rotation.y = THREE.MathUtils.damp(
      assemblyRef.current.rotation.y,
      -0.52 + progress * 1.9,
      3.4,
      delta
    );
    assemblyRef.current.rotation.z = THREE.MathUtils.damp(
      assemblyRef.current.rotation.z,
      -0.08 + progress * 0.2,
      3.4,
      delta
    );
    assemblyRef.current.scale.setScalar(
      THREE.MathUtils.damp(assemblyRef.current.scale.x, targetScale, 3.4, delta)
    );

    ringRef.current.rotation.z = clock.elapsedTime * 0.13 + progress * 2.6;
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.8) * 0.035;
    coreRef.current.scale.setScalar(pulse);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 7.8 - progress * 0.65, 2.5, delta);
  });

  return (
    <group ref={assemblyRef} rotation={[-0.42, -0.52, -0.08]}>
      <mesh castShadow>
        <boxGeometry args={[4.8, 2.8, 0.28]} />
        <meshStandardMaterial color="#071410" metalness={0.88} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0, 0.19]}>
        <boxGeometry args={[4.36, 2.36, 0.12]} />
        <meshStandardMaterial color="#0a241d" metalness={0.58} roughness={0.46} />
      </mesh>

      {FIN_POSITIONS.map((x) => (
        <mesh key={x} position={[x, 0, 0.48]} castShadow>
          <boxGeometry args={[0.075, 2.02, 0.52]} />
          <meshStandardMaterial color="#132a25" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      <group ref={coreRef} position={[0, 0, 0.84]}>
        <mesh castShadow>
          <boxGeometry args={[1.16, 1.16, 0.26]} />
          <meshStandardMaterial
            color="#153b32"
            emissive="#2de8c4"
            emissiveIntensity={0.26}
            metalness={0.72}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <boxGeometry args={[0.8, 0.8, 0.08]} />
          <meshBasicMaterial color="#2de8c4" transparent opacity={0.78} />
        </mesh>
      </group>

      {TRACE_ROWS.map((y) => (
        <group key={y} position={[0, y, 0.61]}>
          <mesh position={[-1.62, 0, 0]}>
            <boxGeometry args={[1.45, 0.018, 0.018]} />
            <meshBasicMaterial color="#2de8c4" transparent opacity={0.72} />
          </mesh>
          <mesh position={[1.62, 0, 0]}>
            <boxGeometry args={[1.45, 0.018, 0.018]} />
            <meshBasicMaterial color="#2de8c4" transparent opacity={0.72} />
          </mesh>
        </group>
      ))}

      <group ref={ringRef} position={[0, 0, 0.98]}>
        <mesh>
          <torusGeometry args={[1.72, 0.012, 8, 96]} />
          <meshBasicMaterial color="#2de8c4" transparent opacity={0.36} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[2.18, 0.008, 8, 96, Math.PI * 1.3]} />
          <meshBasicMaterial color="#8ffff0" transparent opacity={0.18} />
        </mesh>
      </group>
    </group>
  );
}

function EarthObject({ progressRef }) {
  const modelRef = useRef(null);
  const orbitRef = useRef(null);
  const { scene } = useGLTF(ABOUT_MODEL_PATH);

  useFrame(({ clock, camera, size }, delta) => {
    const progress = progressRef.current;
    const targetX = Math.sin(progress * Math.PI * 3.1) * 1.38;
    const targetY = 0.08 + Math.sin(progress * Math.PI * 2) * 0.38;
    const responsiveScale = size.width < 640 ? 0.65 : size.width < 980 ? 0.82 : 0.9;
    const targetScale = (3.35 + Math.sin(progress * Math.PI) * 1.05) * responsiveScale;

    modelRef.current.position.x = THREE.MathUtils.damp(
      modelRef.current.position.x,
      targetX,
      3.8,
      delta
    );
    modelRef.current.position.y = THREE.MathUtils.damp(
      modelRef.current.position.y,
      targetY,
      3.8,
      delta
    );
    modelRef.current.rotation.x = THREE.MathUtils.damp(
      modelRef.current.rotation.x,
      -0.08 + progress * 0.16,
      3.4,
      delta
    );
    modelRef.current.rotation.y = THREE.MathUtils.damp(
      modelRef.current.rotation.y,
      -0.35 + progress * Math.PI * 1.75,
      3.4,
      delta
    );
    modelRef.current.rotation.z = THREE.MathUtils.damp(
      modelRef.current.rotation.z,
      -0.06 + progress * 0.12,
      3.4,
      delta
    );
    modelRef.current.scale.setScalar(
      THREE.MathUtils.damp(modelRef.current.scale.x, targetScale, 3.4, delta)
    );

    modelRef.current.position.y += Math.sin(clock.elapsedTime * 0.42) * 0.0008;
    orbitRef.current.rotation.z = clock.elapsedTime * 0.09 + progress * 2.4;
    orbitRef.current.rotation.x = 1.08 + Math.sin(progress * Math.PI) * 0.28;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 7.8 - progress * 0.55, 2.5, delta);
  });

  return (
    <group ref={modelRef} rotation={[-0.08, -0.35, -0.06]} scale={3.35}>
      <primitive object={scene} />
      <group ref={orbitRef}>
        <mesh rotation={[Math.PI / 2.7, 0, 0]}>
          <torusGeometry args={[0.82, 0.006, 6, 96]} />
          <meshBasicMaterial color="#72ffe8" transparent opacity={0.25} />
        </mesh>
        <mesh rotation={[Math.PI / 1.9, 0.3, 0]}>
          <torusGeometry args={[1.02, 0.004, 6, 96, Math.PI * 1.55]} />
          <meshBasicMaterial color="#2de8c4" transparent opacity={0.15} />
        </mesh>
      </group>
    </group>
  );
}

class ModelBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function Scene({ progressRef }) {
  const nodesRef = useRef(null);

  useFrame(({ clock }) => {
    nodesRef.current.rotation.z = clock.elapsedTime * 0.025;
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 7]} intensity={2.4} color="#d8fff7" />
      <pointLight position={[-4, -2, 4]} intensity={32} distance={10} color="#2de8c4" />
      <pointLight position={[4, 1, 2]} intensity={18} distance={9} color="#187b68" />

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={STAR_POSITIONS}
            count={STAR_POSITIONS.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#8dfff0" size={0.022} transparent opacity={0.58} sizeAttenuation />
      </points>

      <group ref={nodesRef}>
        {NODE_POSITIONS.map((position, index) => (
          <mesh key={position.join('-')} position={position}>
            <sphereGeometry args={[index === 4 ? 0.06 : 0.035, 10, 10]} />
            <meshBasicMaterial color="#2de8c4" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      <ModelBoundary fallback={<ComputeObject progressRef={progressRef} />}>
        <Suspense fallback={<ComputeObject progressRef={progressRef} />}>
          <EarthObject progressRef={progressRef} />
        </Suspense>
      </ModelBoundary>
    </>
  );
}

export function AboutComputeScene({ progressRef, active }) {
  return (
    <Canvas
      className="about-compute-canvas"
      camera={{ position: [0, 0, 7.8], fov: 43, near: 0.1, far: 40 }}
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
    >
      <Scene progressRef={progressRef} />
    </Canvas>
  );
}

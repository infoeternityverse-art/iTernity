import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const TEAL = '#28F5D0';
const CYAN = '#74F7FF';
const VIOLET = '#7B61FF';
const WHITE = '#F5F7F6';
const SPACE = '#020504';
const FOG = '#020806';
const MAX_TILT_X = THREE.MathUtils.degToRad(7);
const MAX_TILT_Y = THREE.MathUtils.degToRad(10);
const CAMERA_REST = new THREE.Vector3(0, 1.5, 8.3);
const LOOK_DISTANCE = 21;
const DESKTOP_MAX_YAW = THREE.MathUtils.degToRad(40);
const DESKTOP_MAX_PITCH = THREE.MathUtils.degToRad(23);
const MOBILE_MAX_YAW = DESKTOP_MAX_YAW;
const MOBILE_MAX_PITCH = DESKTOP_MAX_PITCH;
const MOBILE_IDLE_YAW = THREE.MathUtils.degToRad(3.6);
const MOBILE_IDLE_PITCH = THREE.MathUtils.degToRad(2.2);
const MOBILE_CAMERA_REST = new THREE.Vector3(0, 1.42, 9.7);
const DESKTOP_CAMERA = { position: [0, 1.5, 8.3], fov: 45, near: 0.1, far: 42 };
const MOBILE_CAMERA = { position: [0, 1.42, 9.7], fov: 58, near: 0.1, far: 46 };

const pointVertexShader = `
  attribute float aSize;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vFogDepth;
  uniform float uTime;
  uniform float uTwinkleSpeed;

  void main() {
    float pulse = 0.78 + sin(uTime * uTwinkleSpeed + aPhase) * 0.22;
    vColor = color * pulse;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vFogDepth = -mvPosition.z;
    gl_PointSize = aSize * pulse * (360.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const pointFragmentShader = `
  varying vec3 vColor;
  varying float vFogDepth;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float glow = smoothstep(0.5, 0.0, dist);
    float core = smoothstep(0.12, 0.0, dist);
    float fog = smoothstep(uFogNear, uFogFar, vFogDepth);
    vec3 color = mix(vColor * (0.9 + core * 1.85), uFogColor, fog * 0.72);
    gl_FragColor = vec4(color, glow * (1.0 - fog * 0.68));
  }
`;

function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function PanoramaBackdrop({ isMobile, panoramaSrc, pointerRef, scrollRef }) {
  const meshRef = useRef(null);
  const texture = useLoader(THREE.TextureLoader, panoramaSrc);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;
    const pointer = pointerRef.current;
    const scroll = scrollRef.current || 0;
    const idle = Math.sin(clock.elapsedTime * 0.055) * 0.018;

    meshRef.current.rotation.y = THREE.MathUtils.damp(
      meshRef.current.rotation.y,
      Math.PI + pointer.x * 0.18 + scroll * 0.08 + idle,
      1.8,
      delta,
    );
    meshRef.current.rotation.x = THREE.MathUtils.damp(
      meshRef.current.rotation.x,
      pointer.y * 0.06,
      1.8,
      delta,
    );
  });

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]} renderOrder={-10}>
      <sphereGeometry args={[38, 64, 32]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        toneMapped={false}
        fog={false}
        depthWrite={false}
      />
    </mesh>
  );
}

function makeStarTunnel(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const sizes = new Float32Array(count);
  const palette = [new THREE.Color(WHITE), new THREE.Color(TEAL), new THREE.Color(CYAN), new THREE.Color(VIOLET)];

  for (let index = 0; index < count; index += 1) {
    const angle = seededRandom(index + 11) * Math.PI * 2;
    const radius = 0.8 + Math.pow(seededRandom(index + 13), 0.62) * 13.8;
    const depth = seededRandom(index + 17);
    const color = palette[index % palette.length].clone();
    const brightness = 0.52 + (1 - depth) * 0.56;

    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = Math.sin(angle) * radius * 0.48 + 2.35;
    positions[index * 3 + 2] = -2.5 - depth * 36;
    colors[index * 3] = color.r * brightness;
    colors[index * 3 + 1] = color.g * brightness;
    colors[index * 3 + 2] = color.b * brightness;
    phases[index] = seededRandom(index + 19) * Math.PI * 2;
    sizes[index] = 0.045 + seededRandom(index + 23) * 0.075;
  }

  return { positions, colors, phases, sizes };
}

function makeGalaxySpiral(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const sizes = new Float32Array(count);
  const teal = new THREE.Color(TEAL);
  const cyan = new THREE.Color(CYAN);
  const violet = new THREE.Color(VIOLET);
  const white = new THREE.Color(WHITE);

  for (let index = 0; index < count; index += 1) {
    const arm = index % 4;
    const radius = 0.18 + Math.pow(seededRandom(index + 210), 0.76) * 5.4;
    const angle = radius * 1.8 + arm * (Math.PI / 2) + (seededRandom(index + 220) - 0.5) * 0.38;
    const color = index % 10 === 0 ? white : teal.clone().lerp(index % 3 === 0 ? violet : cyan, seededRandom(index + 240) * 0.48);
    const brightness = 0.44 + (1 - radius / 5.6) * 0.62;

    positions[index * 3] = Math.cos(angle) * radius * 1.28 + 3.2;
    positions[index * 3 + 1] = Math.sin(angle) * radius * 0.48 + 2.75 + (seededRandom(index + 230) - 0.5) * 0.22;
    positions[index * 3 + 2] = -22.5 - radius * 0.32 + (seededRandom(index + 250) - 0.5) * 1.25;
    colors[index * 3] = color.r * brightness;
    colors[index * 3 + 1] = color.g * brightness;
    colors[index * 3 + 2] = color.b * brightness;
    phases[index] = seededRandom(index + 260) * Math.PI * 2;
    sizes[index] = 0.05 + seededRandom(index + 270) * 0.11;
  }

  return { positions, colors, phases, sizes };
}

function makeShimmerField(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const sizes = new Float32Array(count);
  const palette = [new THREE.Color(WHITE), new THREE.Color(CYAN), new THREE.Color(TEAL)];

  for (let index = 0; index < count; index += 1) {
    const color = palette[index % palette.length].clone();
    const band = seededRandom(index + 810);
    const brightness = 0.72 + seededRandom(index + 820) * 0.58;

    positions[index * 3] = -13.5 + seededRandom(index + 830) * 27;
    positions[index * 3 + 1] = -0.2 + band * 6.2;
    positions[index * 3 + 2] = -6 - seededRandom(index + 840) * 30;
    colors[index * 3] = color.r * brightness;
    colors[index * 3 + 1] = color.g * brightness;
    colors[index * 3 + 2] = color.b * brightness;
    phases[index] = seededRandom(index + 850) * Math.PI * 2;
    sizes[index] = 0.018 + Math.pow(seededRandom(index + 860), 2) * 0.075;
  }

  return { positions, colors, phases, sizes };
}

function makeBladeSparkles(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const baseSizes = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const face = Math.floor(seededRandom(index + 4) * 6);
    const x = (seededRandom(index + 8) - 0.5) * 0.52;
    const y = (seededRandom(index + 12) - 0.5) * 3.15;
    const z = (seededRandom(index + 16) - 0.5) * 0.52;
    const color = new THREE.Color(index % 5 === 0 ? WHITE : TEAL);

    positions[index * 3] = face < 2 ? (face === 0 ? -0.3 : 0.3) : x;
    positions[index * 3 + 1] = face >= 2 && face < 4 ? (face === 2 ? -1.75 : 1.75) : y;
    positions[index * 3 + 2] = face >= 4 ? (face === 4 ? -0.3 : 0.3) : z;
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
    phases[index] = seededRandom(index + 20) * Math.PI * 2;
    baseSizes[index] = 0.032 + seededRandom(index + 24) * 0.026;
  }

  return { positions, colors, phases, baseSizes };
}

function StarTunnel({ isMobile, pointerRef, scrollRef }) {
  const groupRef = useRef(null);
  const pointsRef = useRef(null);
  const materialRef = useRef(null);
  const count = isMobile ? 280 : 760;
  const data = useMemo(() => makeStarTunnel(count), [count]);

  useFrame(({ clock }, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }

    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      const scrollPush = (scrollRef.current || 0) * 0.018;

      for (let index = 0; index < count; index += 1) {
        positions[index * 3 + 2] += delta * (0.72 + scrollPush * 6.0);
        if (positions[index * 3 + 2] > 2.4) {
          positions[index * 3 + 2] = -33 - seededRandom(index + 410) * 8;
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (groupRef.current) {
      const pointer = pointerRef.current;
      const scroll = scrollRef.current || 0;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, pointer.x * 0.035 + scroll * 0.22, 1.8, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, pointer.y * 0.018, 1.8, delta);
    }
  });

  return (
    <group ref={groupRef}>
      <points key={`star-tunnel-${count}`} ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={data.positions} count={count} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={data.colors} count={count} itemSize={3} />
          <bufferAttribute attach="attributes-aSize" array={data.sizes} count={count} itemSize={1} />
          <bufferAttribute attach="attributes-aPhase" array={data.phases} count={count} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={pointVertexShader}
          fragmentShader={pointFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uTwinkleSpeed: { value: 1.28 },
            uFogColor: { value: new THREE.Color(FOG) },
            uFogNear: { value: 14 },
            uFogFar: { value: 35 },
          }}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function ShimmerField({ isMobile, pointerRef, scrollRef }) {
  const groupRef = useRef(null);
  const materialRef = useRef(null);
  const count = isMobile ? 160 : 440;
  const data = useMemo(() => makeShimmerField(count), [count]);

  useFrame(({ clock }, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }

    if (!groupRef.current) return;
    const pointer = pointerRef.current;
    const scroll = scrollRef.current || 0;
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, pointer.x * 0.026 + scroll * 0.12, 2, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, pointer.y * 0.012, 2, delta);
    groupRef.current.position.z = Math.sin(clock.elapsedTime * 0.18) * 0.38;
  });

  return (
    <group ref={groupRef}>
      <points key={`shimmer-field-${count}`}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={data.positions} count={count} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={data.colors} count={count} itemSize={3} />
          <bufferAttribute attach="attributes-aSize" array={data.sizes} count={count} itemSize={1} />
          <bufferAttribute attach="attributes-aPhase" array={data.phases} count={count} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={pointVertexShader}
          fragmentShader={pointFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uTwinkleSpeed: { value: 3.4 },
            uFogColor: { value: new THREE.Color(FOG) },
            uFogNear: { value: 16 },
            uFogFar: { value: 38 },
          }}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function GalaxySpiral({ pointerRef, scrollRef }) {
  const groupRef = useRef(null);
  const materialRef = useRef(null);
  const count = 520;
  const data = useMemo(() => makeGalaxySpiral(count), []);

  useFrame(({ clock }, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }

    if (!groupRef.current) return;
    const pointer = pointerRef.current;
    const scroll = scrollRef.current || 0;
    groupRef.current.rotation.z += delta * 0.022;
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, pointer.x * 0.035 + scroll * 0.1, 2, delta);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, pointer.x * 0.1, 2, delta);
  });

  return (
    <group ref={groupRef}>
      <points key={`galaxy-spiral-${count}`}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={data.positions} count={count} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={data.colors} count={count} itemSize={3} />
          <bufferAttribute attach="attributes-aSize" array={data.sizes} count={count} itemSize={1} />
          <bufferAttribute attach="attributes-aPhase" array={data.phases} count={count} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={pointVertexShader}
          fragmentShader={pointFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uTwinkleSpeed: { value: 0.4 },
            uFogColor: { value: new THREE.Color(FOG) },
            uFogNear: { value: 18 },
            uFogFar: { value: 38 },
          }}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function InternalBladeLines() {
  const lines = useMemo(
    () => [
      [[-0.3, -1.3, 0.32], [0.3, -0.56, 0.32]],
      [[0.3, -0.2, 0.32], [-0.3, 0.55, 0.32]],
      [[-0.3, 0.9, 0.32], [0.3, 1.46, 0.32]],
      [[-0.31, -0.95, -0.3], [0.31, 0.15, -0.3]],
      [[0.31, 0.44, -0.3], [-0.31, 1.28, -0.3]],
    ],
    [],
  );

  return (
    <>
      {lines.map(([start, end], index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={new Float32Array([...start, ...end])} count={2} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial color={TEAL} transparent opacity={0.5} fog blending={THREE.AdditiveBlending} />
        </line>
      ))}
    </>
  );
}

function BladeSparkles({ count }) {
  const materialRef = useRef(null);
  const data = useMemo(() => makeBladeSparkles(count), [count]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <points key={`blade-sparkles-${count}`}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={data.colors} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" array={data.baseSizes} count={count} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" array={data.phases} count={count} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={pointVertexShader}
        fragmentShader={pointFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uTwinkleSpeed: { value: 2.2 },
          uFogColor: { value: new THREE.Color(FOG) },
          uFogNear: { value: 10 },
          uFogFar: { value: 34 },
        }}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function WireframeBlade({ isMobile, pointerRef, scrollRef }) {
  const groupRef = useRef(null);
  const idleRotationRef = useRef(-0.18);
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.62, 3.5, 0.62)), []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const pointer = pointerRef.current;
    const scroll = scrollRef.current || 0;

    idleRotationRef.current += delta * 0.09 + scroll * delta * 0.08;
    const targetX = -0.08 + pointer.y * MAX_TILT_X;
    const targetY = idleRotationRef.current + pointer.x * MAX_TILT_Y;

    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 4, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY, 4, delta);
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, -0.12, 4, delta);
  });

  return (
    <group ref={groupRef} position={isMobile ? [0.65, 0.02, -6.4] : [2.35, 0.0, -7.2]} rotation={[-0.08, -0.18, -0.12]} scale={isMobile ? 0.78 : 0.88}>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color={TEAL} transparent opacity={1} fog blending={THREE.AdditiveBlending} />
      </lineSegments>
      <lineSegments geometry={edgesGeometry} scale={[1.05, 1.05, 1.05]}>
        <lineBasicMaterial color={CYAN} transparent opacity={0.22} fog blending={THREE.AdditiveBlending} />
      </lineSegments>
      <InternalBladeLines />
      <BladeSparkles count={isMobile ? 18 : 32} />
    </group>
  );
}

function PlanetarySystem({ isMobile, pointerRef, scrollRef }) {
  const groupRef = useRef(null);
  const moonOrbitRef = useRef(null);
  const farOrbitRef = useRef(null);

  useFrame(({ clock }, delta) => {
    const pointer = pointerRef.current;
    const scroll = scrollRef.current || 0;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, pointer.x * 0.08 + scroll * 0.22, 2.2, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, -0.14 + pointer.y * 0.035, 2.2, delta);
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.25) * 0.1;
    }

    if (moonOrbitRef.current) {
      moonOrbitRef.current.rotation.y += delta * 0.42;
    }

    if (farOrbitRef.current) {
      farOrbitRef.current.rotation.y -= delta * 0.18;
    }
  });

  return (
    <group ref={groupRef} position={isMobile ? [1.7, 1.05, -10.5] : [4.4, 1.1, -12.8]} scale={isMobile ? 0.72 : 1}>
      <mesh>
        <sphereGeometry args={[0.72, 64, 32]} />
        <meshStandardMaterial
          color="#071512"
          emissive={TEAL}
          emissiveIntensity={0.12}
          roughness={0.46}
          metalness={0.08}
          fog
        />
      </mesh>
      <mesh rotation={[1.22, 0.18, -0.28]}>
        <ringGeometry args={[0.96, 1.55, 128]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.46} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[1.22, 0.18, -0.28]} scale={[1.2, 1.2, 1.2]}>
        <ringGeometry args={[1.42, 1.47, 128]} />
        <meshBasicMaterial color={VIOLET} transparent opacity={0.25} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <group ref={moonOrbitRef}>
        <mesh position={[1.8, 0.18, 0.12]}>
          <sphereGeometry args={[0.12, 24, 16]} />
          <meshStandardMaterial color="#DDFDF8" emissive={CYAN} emissiveIntensity={0.35} roughness={0.38} fog />
        </mesh>
      </group>
      <group ref={farOrbitRef}>
        <mesh position={[-2.15, -0.45, -0.45]}>
          <sphereGeometry args={[0.18, 32, 16]} />
          <meshStandardMaterial color="#1B1238" emissive={VIOLET} emissiveIntensity={0.22} roughness={0.5} fog />
        </mesh>
      </group>
    </group>
  );
}

function OrbitalRings({ pointerRef, scrollRef }) {
  const groupRef = useRef(null);
  const rings = useMemo(
    () => [
      { args: [2.35, 0.035, 16, 192], color: TEAL, opacity: 0.78, rotation: [1.18, 0.28, -0.68], scale: [1.28, 0.62, 1] },
      { args: [3.08, 0.026, 16, 192], color: CYAN, opacity: 0.42, rotation: [1.03, 0.44, -0.32], scale: [1.38, 0.52, 1] },
      { args: [3.82, 0.02, 12, 192], color: VIOLET, opacity: 0.34, rotation: [1.28, 0.18, -0.95], scale: [1.44, 0.48, 1] },
    ],
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const pointer = pointerRef.current;
    const scroll = scrollRef.current || 0;
    groupRef.current.rotation.z += delta * 0.018;
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, pointer.x * 0.045 + scroll * 0.18, 2, delta);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, pointer.x * 0.18, 2, delta);
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.18) * 0.08;
  });

  return (
    <group ref={groupRef} position={[2.35, 0.02, -7.2]}>
      {rings.map((ring, index) => (
        <mesh key={index} rotation={ring.rotation} scale={ring.scale}>
          <torusGeometry args={ring.args} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
            depthWrite
            fog
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function MeteorStream({ isMobile, pointerRef, scrollRef }) {
  const groupRef = useRef(null);
  const meteors = useMemo(
    () =>
      Array.from({ length: isMobile ? 7 : 15 }, (_, index) => {
        const x = -7 + seededRandom(index + 1900) * 14;
        const y = 0.4 + seededRandom(index + 1910) * 5.2;
        const z = -8 - seededRandom(index + 1920) * 22;
        const length = 0.45 + seededRandom(index + 1930) * 0.85;
        return {
          points: new Float32Array([x, y, z, x + length, y + length * 0.22, z - length * 1.9]),
          phase: seededRandom(index + 1940) * Math.PI * 2,
          speed: 0.18 + seededRandom(index + 1950) * 0.28,
          color: index % 4 === 0 ? VIOLET : index % 3 === 0 ? WHITE : CYAN,
        };
      }),
    [isMobile],
  );

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const pointer = pointerRef.current;
    const scroll = scrollRef.current || 0;
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, pointer.x * 0.04 + scroll * 0.16, 2, delta);
    groupRef.current.position.z = ((clock.elapsedTime * 0.42 + scroll * 3.2) % 3.2) - 1.6;
  });

  return (
    <group key={`meteor-stream-${meteors.length}`} ref={groupRef}>
      {meteors.map((meteor, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={meteor.points} count={2} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial color={meteor.color} transparent opacity={0.42 + Math.sin(meteor.phase) * 0.12} fog blending={THREE.AdditiveBlending} />
        </line>
      ))}
    </group>
  );
}

function CameraDrift({ pointerRef, scrollRef, isMobile }) {
  const lightRef = useRef(null);
  const lookTargetRef = useRef(new THREE.Vector3(0.6, 0.1, -16.5));
  const directionRef = useRef(new THREE.Vector3());
  const targetLookRef = useRef(new THREE.Vector3());

  useFrame(({ camera, clock }, delta) => {
    const pointer = pointerRef.current;
    const scroll = scrollRef.current || 0;
    const elapsed = clock.elapsedTime;
    const breathing = Math.sin((elapsed / 16) * Math.PI * 2) * 0.16;
    const dolly = (elapsed % 24) / 24;
    const idleYaw = Math.sin(elapsed * 0.16) * (isMobile ? MOBILE_IDLE_YAW : THREE.MathUtils.degToRad(4.5));
    const idlePitch = Math.sin(elapsed * 0.11 + 0.7) * (isMobile ? MOBILE_IDLE_PITCH : THREE.MathUtils.degToRad(2.2));
    const cameraRest = isMobile ? MOBILE_CAMERA_REST : CAMERA_REST;
    const idleStrafe = Math.sin(elapsed * 0.13) * (isMobile ? 0.22 : 0.38);
    const idleLift = Math.sin(elapsed * 0.1 + 1.2) * (isMobile ? 0.07 : 0.08);
    const navScale = 1;
    const response = 4.2;
    const maxYaw = isMobile ? MOBILE_MAX_YAW : DESKTOP_MAX_YAW;
    const maxPitch = isMobile ? MOBILE_MAX_PITCH : DESKTOP_MAX_PITCH;

    const targetYaw = THREE.MathUtils.clamp(
      idleYaw + pointer.x * maxYaw * navScale,
      -maxYaw,
      maxYaw,
    );
    const targetPitch = THREE.MathUtils.clamp(
      idlePitch + pointer.y * maxPitch * navScale,
      -maxPitch,
      maxPitch,
    );

    const forwardBias = (Math.abs(pointer.x) * 0.78 + Math.max(0, -pointer.y) * 0.24) * navScale;
    const targetX = THREE.MathUtils.clamp(
      cameraRest.x + idleStrafe + pointer.x * (isMobile ? 2.2 : 2.7) * navScale + Math.sin(scroll * Math.PI * 2) * (isMobile ? 0.2 : 0.24),
      isMobile ? -2.65 : -3.05,
      isMobile ? 2.65 : 3.05,
    );
    const targetY = THREE.MathUtils.clamp(
      cameraRest.y + idleLift + pointer.y * (isMobile ? 0.68 : 0.72) * navScale,
      isMobile ? 0.88 : 0.88,
      isMobile ? 2.35 : 2.38,
    );
    const targetZ = THREE.MathUtils.clamp(
      cameraRest.z - dolly * (isMobile ? 0.62 : 0.72) - scroll * (isMobile ? 0.62 : 0.72) + breathing - forwardBias,
      isMobile ? 8.15 : 6.55,
      isMobile ? 10.25 : 8.65,
    );

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, isMobile ? 2.65 : 2.75, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, isMobile ? 2.35 : 2.45, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, isMobile ? 2.15 : 2.25, delta);

    directionRef.current
      .set(
        Math.sin(targetYaw) * Math.cos(targetPitch),
        Math.sin(targetPitch),
        -Math.cos(targetYaw) * Math.cos(targetPitch),
      )
      .normalize();
    targetLookRef.current
      .copy(camera.position)
      .addScaledVector(directionRef.current, LOOK_DISTANCE);
    targetLookRef.current.x += isMobile ? 0.35 : 0;
    targetLookRef.current.y += -0.05 - scroll * 0.8;

    lookTargetRef.current.lerp(targetLookRef.current, 1 - Math.exp(-response * delta));
    camera.lookAt(lookTargetRef.current);

    if (lightRef.current) {
      lightRef.current.position.copy(camera.position);
      lightRef.current.position.y += 0.12;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      color={TEAL}
      intensity={isMobile ? 0.24 : 0.38}
      distance={5.8}
      decay={2}
    />
  );
}

function HeroScene({ isMobile, panoramaSrc, pointerRef, scrollRef }) {
  return (
    <>
      <fogExp2 attach="fog" args={[FOG, 0.032]} />
      <PanoramaBackdrop isMobile={isMobile} panoramaSrc={panoramaSrc} pointerRef={pointerRef} scrollRef={scrollRef} />
      <CameraDrift pointerRef={pointerRef} scrollRef={scrollRef} isMobile={isMobile} />
      <StarTunnel isMobile={isMobile} pointerRef={pointerRef} scrollRef={scrollRef} />
      <ShimmerField isMobile={isMobile} pointerRef={pointerRef} scrollRef={scrollRef} />
      {!isMobile && <GalaxySpiral pointerRef={pointerRef} scrollRef={scrollRef} />}
      <MeteorStream isMobile={isMobile} pointerRef={pointerRef} scrollRef={scrollRef} />
    </>
  );
}

export default function HeroWireframeScene({
  isMobile,
  panoramaSrc = '/media/hero_home.webp',
  pointerRef,
  scrollRef,
  onReady,
}) {
  const camera = isMobile ? MOBILE_CAMERA : DESKTOP_CAMERA;

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="always"
      camera={camera}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        onReady?.();
      }}
    >
      <ambientLight intensity={0.34} />
      <directionalLight position={[-4, 5, 5]} intensity={0.76} color="#D8FFF8" />
      <pointLight position={[2.2, 2.4, -6.4]} intensity={1.8} color={TEAL} distance={9} />
      <HeroScene isMobile={isMobile} panoramaSrc={panoramaSrc} pointerRef={pointerRef} scrollRef={scrollRef} />
    </Canvas>
  );
}

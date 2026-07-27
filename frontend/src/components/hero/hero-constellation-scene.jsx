import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const IDLE_COLOR = new THREE.Color('#8969EF');
const GOLD_COLOR = new THREE.Color('#F0C863');
const NODE_COUNT_DESKTOP = 112;
const NODE_COUNT_MOBILE = 48;
const MAX_WEB_PULSES = 5;
const MAX_SOURCE_PULSES = 4;

const pointVertexShader = `
  attribute float aSize;
  varying vec3 vColor;
  varying float vDepth;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = smoothstep(-3.0, 3.0, mvPosition.z);
    gl_PointSize = aSize * (1.0 / max(0.42, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const pointFragmentShader = `
  varying vec3 vColor;
  varying float vDepth;
  uniform float uOpacity;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    float core = smoothstep(0.4, 0.0, dist);
    float halo = smoothstep(0.5, 0.08, dist) * 0.5;
    float alpha = (core + halo) * uOpacity * mix(0.75, 1.2, vDepth);

    if (alpha < 0.02) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function makeNodeCloud(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const nodes = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const jitter = 0.78 + seededRandom(i + 2) * 0.35;
    const x = Math.cos(theta) * radius * jitter * 2.7;
    const z = Math.sin(theta) * radius * jitter * 1.25;
    const py = y * jitter * 1.72;
    const size = 34 + seededRandom(i + 11) * 18;
    const brightness = 0.9 + (z / 1.25) * 0.18;

    positions[i * 3] = x;
    positions[i * 3 + 1] = py;
    positions[i * 3 + 2] = z;
    colors[i * 3] = IDLE_COLOR.r * brightness;
    colors[i * 3 + 1] = IDLE_COLOR.g * brightness;
    colors[i * 3 + 2] = IDLE_COLOR.b * brightness;
    sizes[i] = size;
    phases[i] = seededRandom(i + 29) * Math.PI * 2;
    nodes.push(new THREE.Vector3(x, py, z));
  }

  return { positions, colors, sizes, phases, nodes };
}

function FrameLimiter() {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const interval = window.setInterval(invalidate, 1000 / 30);
    return () => window.clearInterval(interval);
  }, [invalidate]);

  return null;
}

function ConnectionWeb({ cloud }) {
  const geometry = useMemo(() => {
    const segments = [];

    cloud.nodes.forEach((node, index) => {
      const nearest = cloud.nodes
        .map((other, otherIndex) => ({
          index: otherIndex,
          distance: other.distanceToSquared(node),
        }))
        .filter((item) => item.index !== index && item.index > index)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, index % 3 === 0 ? 2 : 1);

      nearest.forEach((item) => {
        if (item.distance > 0.62) return;
        const target = cloud.nodes[item.index];
        segments.push(node.x, node.y, node.z, target.x, target.y, target.z);
      });
    });

    const output = new THREE.BufferGeometry();
    output.setAttribute('position', new THREE.Float32BufferAttribute(segments, 3));
    return output;
  }, [cloud.nodes]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#8969EF" transparent opacity={0.2} depthWrite={false} />
    </lineSegments>
  );
}

function NodePoints({ cloud }) {
  const pointsRef = useRef(null);
  const basePositions = cloud.positions;
  const driftedPositions = useMemo(() => new Float32Array(basePositions), [basePositions]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const elapsed = clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < cloud.phases.length; i += 1) {
      const phase = cloud.phases[i];
      positions[i * 3] = basePositions[i * 3] + Math.sin(elapsed * 0.42 + phase) * 0.035;
      positions[i * 3 + 1] = basePositions[i * 3 + 1] + Math.cos(elapsed * 0.36 + phase * 1.7) * 0.045;
      positions[i * 3 + 2] = basePositions[i * 3 + 2] + Math.sin(elapsed * 0.31 + phase * 0.8) * 0.03;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={driftedPositions} count={cloud.nodes.length} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={cloud.colors} count={cloud.nodes.length} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" array={cloud.sizes} count={cloud.nodes.length} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={pointVertexShader}
        fragmentShader={pointFragmentShader}
        uniforms={{ uOpacity: { value: 0.78 } }}
        blending={THREE.NormalBlending}
        transparent
        vertexColors
        depthWrite={false}
      />
    </points>
  );
}

function HighlightPoints({ cloud, activeIndices, heroIndex }) {
  const pointsRef = useRef(null);
  const positions = useMemo(() => new Float32Array((activeIndices.length + 1) * 3), [activeIndices.length]);
  const colors = useMemo(() => new Float32Array((activeIndices.length + 1) * 3), [activeIndices.length]);
  const sizes = useMemo(() => {
    const output = new Float32Array(activeIndices.length + 1);
    output.fill(66);
    output[activeIndices.length] = 98;
    return output;
  }, [activeIndices.length]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const elapsed = clock.elapsedTime;
    const positionArray = pointsRef.current.geometry.attributes.position.array;
    const colorArray = pointsRef.current.geometry.attributes.color.array;
    const indices = [...activeIndices, heroIndex];

    indices.forEach((nodeIndex, outputIndex) => {
      const node = cloud.nodes[nodeIndex];
      const pulse = outputIndex === indices.length - 1 ? 1 + Math.sin(elapsed * 2.2) * 0.2 : 1;
      const color = outputIndex === indices.length - 1 ? GOLD_COLOR : IDLE_COLOR;
      positionArray[outputIndex * 3] = node.x + Math.sin(elapsed * 0.5 + nodeIndex) * 0.035;
      positionArray[outputIndex * 3 + 1] = node.y + Math.cos(elapsed * 0.42 + nodeIndex) * 0.045;
      positionArray[outputIndex * 3 + 2] = node.z;
      colorArray[outputIndex * 3] = color.r * pulse;
      colorArray[outputIndex * 3 + 1] = color.g * pulse;
      colorArray[outputIndex * 3 + 2] = color.b * pulse;
    });

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={activeIndices.length + 1} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={activeIndices.length + 1} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" array={sizes} count={activeIndices.length + 1} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={pointVertexShader}
        fragmentShader={pointFragmentShader}
        uniforms={{ uOpacity: { value: 1 } }}
        blending={THREE.NormalBlending}
        transparent
        vertexColors
        depthWrite={false}
      />
    </points>
  );
}

function CentralChip({ isMobile }) {
  const logoTexture = useTexture('/media/logo1.png');

  useEffect(() => {
    if (!logoTexture) return;
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    logoTexture.anisotropy = 4;
    logoTexture.needsUpdate = true;
  }, [logoTexture]);

  const edgePath = useMemo(
    () => [
      new THREE.Vector3(-0.62, -0.62, 0.135),
      new THREE.Vector3(0.62, -0.62, 0.135),
      new THREE.Vector3(0.62, 0.62, 0.135),
      new THREE.Vector3(-0.62, 0.62, 0.135),
      new THREE.Vector3(-0.62, -0.62, 0.135),
    ],
    [],
  );

  const innerEdgePath = useMemo(
    () => [
      new THREE.Vector3(-0.46, -0.46, 0.14),
      new THREE.Vector3(0.46, -0.46, 0.14),
      new THREE.Vector3(0.46, 0.46, 0.14),
      new THREE.Vector3(-0.46, 0.46, 0.14),
      new THREE.Vector3(-0.46, -0.46, 0.14),
    ],
    [],
  );

  const tracePaths = useMemo(
    () => [
      [[-0.48, 0.18, 0.145], [-0.26, 0.18, 0.145], [-0.14, 0.08, 0.145], [0.12, 0.08, 0.145], [0.34, 0.24, 0.145]],
      [[-0.44, -0.2, 0.145], [-0.2, -0.2, 0.145], [-0.06, -0.08, 0.145], [0.2, -0.08, 0.145], [0.42, -0.24, 0.145]],
      [[-0.3, 0.36, 0.145], [-0.08, 0.28, 0.145], [0.12, 0.28, 0.145], [0.34, 0.4, 0.145]],
      [[-0.34, -0.38, 0.145], [-0.08, -0.28, 0.145], [0.1, -0.3, 0.145], [0.3, -0.4, 0.145]],
      [[0, -0.46, 0.145], [0, -0.2, 0.145], [0, 0.2, 0.145], [0, 0.46, 0.145]],
    ],
    [],
  );

  return (
    <group position={[0, 0, 0.46]} scale={isMobile ? 0.78 : 0.94}>
      <mesh position={[0, 0, -0.12]}>
        <circleGeometry args={[1.06, 48]} />
        <meshBasicMaterial color="#8969EF" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh>
        <boxGeometry args={[1.18, 1.18, 0.16]} />
        <meshStandardMaterial
          color="#FBF7F2"
          roughness={0.58}
          metalness={0.02}
          emissive="#8969EF"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[0, 0, 0.086]}>
        <boxGeometry args={[0.92, 0.92, 0.018]} />
        <meshBasicMaterial color="#8969EF" transparent opacity={0.2} depthWrite={false} />
      </mesh>

      <Line points={edgePath} color="#8969EF" lineWidth={3.4} transparent opacity={0.86} />
      <Line points={innerEdgePath} color="#FBF7F2" lineWidth={1.6} transparent opacity={0.8} />

      {Array.from({ length: 11 }, (_, index) => {
        const offset = -0.48 + index * 0.096;
        return (
          <group key={index}>
            <mesh position={[offset, 0.66, 0]}>
              <boxGeometry args={[0.035, 0.16, 0.035]} />
              <meshBasicMaterial color="#8969EF" transparent opacity={0.42} />
            </mesh>
            <mesh position={[offset, -0.66, 0]}>
              <boxGeometry args={[0.035, 0.16, 0.035]} />
              <meshBasicMaterial color="#8969EF" transparent opacity={0.42} />
            </mesh>
            <mesh position={[0.66, offset, 0]}>
              <boxGeometry args={[0.16, 0.035, 0.035]} />
              <meshBasicMaterial color="#8969EF" transparent opacity={0.42} />
            </mesh>
            <mesh position={[-0.66, offset, 0]}>
              <boxGeometry args={[0.16, 0.035, 0.035]} />
              <meshBasicMaterial color="#8969EF" transparent opacity={0.42} />
            </mesh>
          </group>
        );
      })}

      {tracePaths.map((points, index) => (
        <Line
          key={index}
          points={points.map(([x, y, z]) => new THREE.Vector3(x, y, z))}
          color="#8969EF"
          lineWidth={1.7}
          transparent
          opacity={0.7}
        />
      ))}

      <mesh position={[0, 0.1, 0.17]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial
          map={logoTexture}
          transparent
          opacity={0.96}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-8}
        />
      </mesh>

      <Text
        position={[0, -0.32, 0.19]}
        fontSize={0.17}
        color="#17161D"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.006}
        outlineColor="#FBF7F2"
      >
        GPU
      </Text>
    </group>
  );
}

function WebPulse({ start, end, duration }) {
  const dotRef = useRef(null);
  const lineRef = useRef(null);
  const startTimeRef = useRef(null);

  useFrame(({ clock }) => {
    if (startTimeRef.current === null) startTimeRef.current = clock.elapsedTime;

    const progress = THREE.MathUtils.clamp((clock.elapsedTime - startTimeRef.current) / duration, 0, 1);
    const fade = Math.sin(progress * Math.PI);
    const current = start.clone().lerp(end, progress);

    if (dotRef.current) {
      dotRef.current.position.copy(current);
      dotRef.current.material.opacity = fade;
    }

    if (lineRef.current?.material) {
      lineRef.current.material.opacity = fade * 0.26;
    }
  });

  return (
    <group>
      <Line ref={lineRef} points={[start, end]} color="#8969EF" lineWidth={2} transparent opacity={0} />
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.052, 14, 14]} />
        <meshBasicMaterial color="#8969EF" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function SourcePulse({ end, duration }) {
  const dotRef = useRef(null);
  const haloRef = useRef(null);
  const lineRef = useRef(null);
  const startTimeRef = useRef(null);
  const start = useMemo(() => new THREE.Vector3(0, 0, 0.52), []);
  const destination = useMemo(() => end.clone().multiplyScalar(0.88), [end]);

  useFrame(({ clock }) => {
    if (startTimeRef.current === null) startTimeRef.current = clock.elapsedTime;

    const progress = THREE.MathUtils.clamp((clock.elapsedTime - startTimeRef.current) / duration, 0, 1);
    const fade = Math.sin(progress * Math.PI);
    const current = start.clone().lerp(destination, progress);

    if (dotRef.current) {
      dotRef.current.position.copy(current);
      dotRef.current.material.opacity = 0.92 * fade;
    }

    if (haloRef.current) {
      haloRef.current.position.copy(current);
      haloRef.current.scale.setScalar(1 + fade * 1.35);
      haloRef.current.material.opacity = 0.2 * fade;
    }

    if (lineRef.current?.material) {
      lineRef.current.material.opacity = 0.12 + fade * 0.38;
    }
  });

  return (
    <group>
      <Line ref={lineRef} points={[start, destination]} color="#8969EF" lineWidth={2.4} transparent opacity={0} />
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.13, 14, 14]} />
        <meshBasicMaterial color="#8969EF" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.072, 16, 16]} />
        <meshBasicMaterial color="#8969EF" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function ComputeConstellation({ isMobile }) {
  const webGroupRef = useRef(null);
  const pulseIdRef = useRef(0);
  const sourcePulseIdRef = useRef(0);
  const nodeCount = isMobile ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
  const cloud = useMemo(() => makeNodeCloud(nodeCount), [nodeCount]);
  const heroIndex = Math.floor(nodeCount * 0.42);
  const [activeIndices, setActiveIndices] = useState([9, 27, 44, 63, 86].filter((index) => index < nodeCount));
  const [webPulses, setWebPulses] = useState([]);
  const [sourcePulses, setSourcePulses] = useState([]);

  useEffect(() => {
    const rotateActive = window.setInterval(() => {
      setActiveIndices(() => {
        const totalActive = isMobile ? 3 : 5;
        return Array.from({ length: totalActive }, (_, i) => {
          const seed = Date.now() * 0.001 + i * 17;
          return Math.floor(seededRandom(seed) * (nodeCount - 1));
        }).filter((index) => index !== heroIndex);
      });
    }, 3200);

    return () => window.clearInterval(rotateActive);
  }, [heroIndex, isMobile, nodeCount]);

  useEffect(() => {
    let timeoutId;

    const scheduleWebPulse = () => {
      const sourcePool = [heroIndex, ...activeIndices];
      const fromIndex = sourcePool[Math.floor(Math.random() * sourcePool.length)] ?? heroIndex;
      const from = cloud.nodes[fromIndex];
      const nearest = cloud.nodes
        .map((node, index) => ({ index, distance: node.distanceToSquared(from) }))
        .filter((item) => item.index !== fromIndex)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 18);
      const toIndex = nearest[Math.floor(Math.random() * nearest.length)]?.index ?? heroIndex;

      setWebPulses((items) => [
        ...items.slice(-(MAX_WEB_PULSES - 1)),
        {
          id: pulseIdRef.current,
          start: cloud.nodes[fromIndex],
          end: cloud.nodes[toIndex],
          duration: 0.85 + Math.random() * 0.35,
        },
      ]);
      pulseIdRef.current += 1;
      timeoutId = window.setTimeout(scheduleWebPulse, 1700 + Math.random() * 1700);
    };

    timeoutId = window.setTimeout(scheduleWebPulse, 900);
    return () => window.clearTimeout(timeoutId);
  }, [activeIndices, cloud.nodes, heroIndex]);

  useEffect(() => {
    let timeoutId;

    const scheduleSourcePulse = () => {
      const destinationPool = [heroIndex, ...activeIndices];
      const destinationIndex = destinationPool[Math.floor(Math.random() * destinationPool.length)] ?? heroIndex;

      setSourcePulses((items) => [
        ...items.slice(-(MAX_SOURCE_PULSES - 1)),
        {
          id: sourcePulseIdRef.current,
          end: cloud.nodes[destinationIndex],
          duration: 1.1 + Math.random() * 0.35,
        },
      ]);
      sourcePulseIdRef.current += 1;
      timeoutId = window.setTimeout(scheduleSourcePulse, 1100 + Math.random() * 1200);
    };

    timeoutId = window.setTimeout(scheduleSourcePulse, 450);
    return () => window.clearTimeout(timeoutId);
  }, [activeIndices, cloud.nodes, heroIndex]);

  useFrame(({ clock, pointer }) => {
    if (!webGroupRef.current) return;

    const elapsed = clock.elapsedTime;
    const targetX = isMobile ? 0.14 : 0.14 + pointer.y * 0.1;
    const targetY = isMobile ? elapsed * 0.12 : elapsed * 0.12 + pointer.x * 0.12;
    webGroupRef.current.rotation.x = THREE.MathUtils.lerp(webGroupRef.current.rotation.x, targetX, 0.04);
    webGroupRef.current.rotation.y = THREE.MathUtils.lerp(webGroupRef.current.rotation.y, targetY, 0.035);
    webGroupRef.current.rotation.z = Math.sin(elapsed * 0.08) * 0.08;
  });

  return (
    <>
      <group ref={webGroupRef} rotation={[0.14, -0.22, 0.06]} scale={1.12}>
        <ConnectionWeb cloud={cloud} />
        <NodePoints cloud={cloud} />
        <HighlightPoints cloud={cloud} activeIndices={activeIndices} heroIndex={heroIndex} />
        {webPulses.map((pulse) => (
          <WebPulse key={pulse.id} {...pulse} />
        ))}
        {sourcePulses.map((pulse) => (
          <SourcePulse key={pulse.id} {...pulse} />
        ))}
      </group>
      <CentralChip isMobile={isMobile} />
    </>
  );
}

export default function HeroConstellationScene({ isMobile }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.6], fov: 44 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <FrameLimiter />
      <ambientLight intensity={1.15} />
      <directionalLight position={[-2.5, 3, 4]} intensity={1.2} color="#FBF7F2" />
      <ComputeConstellation isMobile={isMobile} />
    </Canvas>
  );
}

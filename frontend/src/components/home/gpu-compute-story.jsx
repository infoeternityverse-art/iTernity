import { useEffect, useMemo, useRef, useState } from 'react';

const FRAME_SEQUENCE = {
  folder: '/media/gpu frames',
  prefix: 'ezgif-frame-',
  extension: 'jpg',
  totalFrames: 300,
  padding: 3,
  width: 1280,
  height: 720,
};

const stages = [
  { label: 'Ignition', start: 0, end: 0.16 },
  { label: 'Power', start: 0.16, end: 0.32 },
  { label: 'Scale', start: 0.32, end: 0.5 },
  { label: 'Performance', start: 0.5, end: 0.66 },
  { label: 'Capabilities', start: 0.66, end: 0.82 },
  { label: 'Limitless', start: 0.82, end: 1 },
];

const infrastructureCards = [
  ['Massive Compute', 'GPU clusters ready for demanding AI and rendering workloads.'],
  ['AI Ready', 'Training, inference, fine tuning, notebooks, and research environments.'],
  ['Enterprise Scale', 'Reliable access for individuals, startups, and organizations.'],
];

const stats = [
  // ['99.99%', 'Reliability'],
  ['24/7', 'Availability'],
  ['Low', 'Latency'],
  ['GPU', 'Infrastructure'],
];

const chips = [
  'AI Training',
  'LLM',
  'Inference',
  'Rendering',
  'CUDA',
  'PyTorch',
  'TensorFlow',
  'Jupyter',
  'Docker',
  'ComfyUI',
  'Ollama',
  'Stable Diffusion',
];

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const formatFrame = (frame) => {
  const id = String(frame).padStart(FRAME_SEQUENCE.padding, '0');
  return encodeURI(`${FRAME_SEQUENCE.folder}/${FRAME_SEQUENCE.prefix}${id}.${FRAME_SEQUENCE.extension}`);
};

const inRange = (progress, start, end) => {
  const fade = 0.035;
  const fadeIn = clamp((progress - start) / fade);
  const fadeOut = clamp((end - progress) / fade);
  return Math.min(fadeIn, fadeOut);
};

const stageStyle = (progress, start, end, baseTransform = '') => {
  const visible = inRange(progress, start, end);

  return {
    opacity: visible,
    transform: `${baseTransform} translate3d(0, ${(1 - visible) * 18}px, 0)`,
    filter: `blur(${(1 - visible) * 8}px)`,
    pointerEvents: visible > 0.6 ? 'auto' : 'none',
  };
};

function useFrameCanvas() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const cacheRef = useRef(new Map());
  const rafRef = useRef(0);
  const currentFrameRef = useRef(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const cache = cacheRef.current;

    const loadFrame = (frame) => {
      if (frame < 1 || frame > FRAME_SEQUENCE.totalFrames || cache.has(frame)) return;

      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        if (currentFrameRef.current === frame) drawFrame(frame);
      };
      image.src = formatFrame(frame);
      cache.set(frame, image);
    };

    const drawFrame = (frame) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d', { alpha: false });
      const exact = cache.get(frame);
      const fallback =
        exact?.complete && exact.naturalWidth
          ? exact
          : [...cache.entries()]
              .filter(([, image]) => image.complete && image.naturalWidth)
              .sort(([a], [b]) => Math.abs(a - frame) - Math.abs(b - frame))[0]?.[1];

      if (!fallback) return;

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.clearRect(0, 0, FRAME_SEQUENCE.width, FRAME_SEQUENCE.height);
      context.drawImage(fallback, 0, 0, FRAME_SEQUENCE.width, FRAME_SEQUENCE.height);
    };

    const preloadAround = (frame) => {
      const radius = window.matchMedia('(max-width: 768px)').matches ? 28 : 48;
      for (let index = frame - radius; index <= frame + radius; index += 1) {
        loadFrame(index);
      }

      for (const cachedFrame of cache.keys()) {
        if (Math.abs(cachedFrame - frame) > radius * 2.4) {
          const image = cache.get(cachedFrame);
          if (image) image.src = '';
          cache.delete(cachedFrame);
        }
      }
    };

    const update = () => {
      rafRef.current = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
      const nextProgress = clamp(-rect.top / scrollable);
      const nextFrame = Math.round(nextProgress * (FRAME_SEQUENCE.totalFrames - 1)) + 1;

      preloadAround(nextFrame);
      if (nextFrame !== currentFrameRef.current) {
        currentFrameRef.current = nextFrame;
        drawFrame(nextFrame);
      }

      setProgress((current) => (Math.abs(current - nextProgress) > 0.006 ? nextProgress : current));
    };

    const requestUpdate = () => {
      if (!rafRef.current) rafRef.current = window.requestAnimationFrame(update);
    };

    const firstFrame = new Image();
    firstFrame.decoding = 'sync';
    firstFrame.onload = () => drawFrame(1);
    firstFrame.src = formatFrame(1);
    cache.set(1, firstFrame);
    preloadAround(1);
    update();

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      for (const image of cache.values()) image.src = '';
      cache.clear();
    };
  }, []);

  return { sectionRef, canvasRef, progress };
}

export function GpuComputeStory() {
  const { sectionRef, canvasRef, progress } = useFrameCanvas();
  const activeStage = useMemo(() => {
    return stages.find((stage) => progress >= stage.start && progress <= stage.end) || stages.at(-1);
  }, [progress]);

  return (
    <section
      ref={sectionRef}
      className="compute-story-section relative left-1/2 -ml-[50vw] w-screen max-w-[100vw]"
      style={{ '--compute-progress': progress }}
      aria-label="GPU infrastructure story"
    >
      <div className="compute-story-sticky">
        <div className="compute-frame-shell" aria-hidden="true">
          <canvas
            ref={canvasRef}
            className="compute-story-canvas"
            width={FRAME_SEQUENCE.width}
            height={FRAME_SEQUENCE.height}
          />
        </div>

        <div className="compute-stage compute-stage-ignition" style={stageStyle(progress, 0, 0.16)}>
          <p>GPU CLOUD</p>
          <h2>The Future Begins With Compute</h2>
          <span>Scalable acceleration for teams building beyond ordinary limits.</span>
        </div>

        <div className="compute-stage compute-stage-power" style={stageStyle(progress, 0.16, 0.32)}>
          <h2>Raw GPU power, orchestrated for real work.</h2>
          <p>Train, render, infer, and experiment on infrastructure built for serious throughput.</p>
        </div>

        <div className="compute-card-rail" style={stageStyle(progress, 0.32, 0.5)}>
          {infrastructureCards.map(([title, description], index) => (
            <article className="compute-glass-card" key={title} style={{ '--card-index': index }}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>

        <div className="compute-stat-rail" style={stageStyle(progress, 0.5, 0.66)}>
          {stats.map(([value, label]) => (
            <div className="compute-stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="compute-chip-field" style={stageStyle(progress, 0.66, 0.82)}>
          {chips.map((chip, index) => (
            <span className="compute-chip" key={chip} style={{ '--chip-index': index }}>
              {chip}
            </span>
          ))}
        </div>

        <div
          className="compute-stage compute-stage-message"
          style={stageStyle(progress, 0.82, 1, 'translate3d(-50%, -50%, 0)')}
        >
          <h2>Compute Without Limits</h2>
          <p>Powering the next generation of AI innovation with scalable GPU infrastructure.</p>
        </div>

        <div className="compute-progress-rail" aria-hidden="true">
          <span className="compute-progress-fill" />
          <p>{activeStage.label}</p>
        </div>
      </div>
    </section>
  );
}

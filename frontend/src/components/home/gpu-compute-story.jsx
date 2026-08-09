import { useEffect, useMemo, useRef, useState } from 'react';

const FRAME_SEQUENCE = {
  folder: '/media/gpu frames',
  prefix: 'ezgif-frame-',
  extension: 'jpg',
  totalFrames: 240,
  padding: 3,
  width: 1280,
  height: 720,
};

const FRAME_PROFILES = {
  mobile: { width: 640, height: 360, radius: 4, maxCached: 12, concurrency: 2 },
  tablet: { width: 960, height: 540, radius: 6, maxCached: 20, concurrency: 3 },
  desktop: { width: 1280, height: 720, radius: 8, maxCached: 28, concurrency: 4 },
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
    pointerEvents: visible > 0.6 ? 'auto' : 'none',
  };
};

const getFrameProfile = () => {
  if (window.matchMedia('(max-width: 640px)').matches) return FRAME_PROFILES.mobile;
  if (window.matchMedia('(max-width: 1023px)').matches) return FRAME_PROFILES.tablet;
  return FRAME_PROFILES.desktop;
};

const buildFramePriority = (frame, direction, radius) => {
  const frames = [frame];

  for (let offset = 1; offset <= radius; offset += 1) {
    frames.push(frame + offset * direction, frame - offset * direction);
  }

  return frames.filter(
    (candidate, index) =>
      candidate >= 1 &&
      candidate <= FRAME_SEQUENCE.totalFrames &&
      frames.indexOf(candidate) === index
  );
};

function useFrameCanvas() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return undefined;

    const context = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!context) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cache = new Map();
    const pending = new Map();
    const queued = new Set();
    let queue = [];
    let profile = getFrameProfile();
    let activeLoads = 0;
    let disposed = false;
    let isNearViewport = false;
    let isPageVisible = !document.hidden;
    let targetProgress = 0;
    let renderedProgress = 0;
    let targetFrame = 1;
    let drawnFrame = 0;
    let direction = 1;
    let measurementFrame = 0;
    let motionFrame = 0;
    let lastProgressCommit = 0;
    let hasMeasured = false;

    const setCanvasProfile = () => {
      const nextProfile = getFrameProfile();
      profile = nextProfile;

      if (canvas.width !== profile.width || canvas.height !== profile.height) {
        canvas.width = profile.width;
        canvas.height = profile.height;
        drawnFrame = 0;
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = profile === FRAME_PROFILES.desktop ? 'high' : 'medium';
    };

    const releaseEntry = (entry) => {
      entry?.drawable?.close?.();
      if (entry?.image && entry.drawable === entry.image) entry.image.src = '';
    };

    const findNearestEntry = (frame) => {
      let nearestFrame = 0;
      let nearestEntry = null;
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (const [cachedFrame, entry] of cache) {
        const distance = Math.abs(cachedFrame - frame);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestFrame = cachedFrame;
          nearestEntry = entry;
        }
      }

      return nearestEntry ? { frame: nearestFrame, entry: nearestEntry } : null;
    };

    const drawNearestFrame = (frame, force = false) => {
      const match = cache.has(frame)
        ? { frame, entry: cache.get(frame) }
        : findNearestEntry(frame);

      if (!match || (!force && drawnFrame === match.frame)) return;

      context.drawImage(match.entry.drawable, 0, 0, canvas.width, canvas.height);
      match.entry.lastUsed = performance.now();
      drawnFrame = match.frame;
      setIsReady(true);
    };

    const pruneCache = () => {
      if (cache.size <= profile.maxCached) return;

      const removable = [...cache.entries()]
        .filter(([frame]) => frame !== drawnFrame && frame !== targetFrame)
        .sort(([frameA, entryA], [frameB, entryB]) => {
          const distanceDifference =
            Math.abs(frameB - targetFrame) - Math.abs(frameA - targetFrame);
          return distanceDifference || entryA.lastUsed - entryB.lastUsed;
        });

      while (cache.size > profile.maxCached && removable.length) {
        const [frame, entry] = removable.shift();
        releaseEntry(entry);
        cache.delete(frame);
      }
    };

    const createDrawable = async (image) => {
      if (typeof window.createImageBitmap !== 'function') return image;

      try {
        return await window.createImageBitmap(image, {
          resizeWidth: profile.width,
          resizeHeight: profile.height,
          resizeQuality: profile === FRAME_PROFILES.desktop ? 'high' : 'medium',
        });
      } catch {
        return image;
      }
    };

    const pumpQueue = () => {
      if (disposed || !isNearViewport || !isPageVisible) return;

      while (activeLoads < profile.concurrency && queue.length) {
        const frame = queue.shift();
        queued.delete(frame);
        if (cache.has(frame) || pending.has(frame)) continue;

        activeLoads += 1;
        const image = new Image();
        image.decoding = 'async';
        image.fetchPriority = frame === targetFrame ? 'high' : 'low';
        pending.set(frame, image);

        const finish = () => {
          pending.delete(frame);
          activeLoads = Math.max(0, activeLoads - 1);
          pumpQueue();
        };

        image.onload = async () => {
          try {
            await image.decode?.();
            if (disposed) return;

            const drawable = await createDrawable(image);
            if (disposed) {
              drawable?.close?.();
              return;
            }

            cache.set(frame, { drawable, image, lastUsed: performance.now() });
            if (drawable !== image) {
              image.onload = null;
              image.onerror = null;
              image.src = '';
            }
            drawNearestFrame(targetFrame, frame === targetFrame);
            pruneCache();
          } catch {
            // A nearby decoded frame remains visible if one frame cannot be decoded.
          } finally {
            finish();
          }
        };

        image.onerror = finish;
        image.src = formatFrame(frame);
      }
    };

    const scheduleFrames = (frame) => {
      const radius = reducedMotion ? 0 : profile.radius;
      queue = [];
      queued.clear();

      for (const candidate of buildFramePriority(frame, direction, radius)) {
        if (cache.has(candidate) || pending.has(candidate)) continue;
        queue.push(candidate);
        queued.add(candidate);
      }

      pumpQueue();
      drawNearestFrame(frame);
    };

    const commitProgress = (timestamp, force = false) => {
      if (!force && timestamp - lastProgressCommit < 32) return;
      lastProgressCommit = timestamp;
      setProgress(renderedProgress);
    };

    const runMotion = (timestamp) => {
      motionFrame = 0;
      if (!isNearViewport || !isPageVisible) return;

      const difference = targetProgress - renderedProgress;
      renderedProgress =
        reducedMotion || Math.abs(difference) < 0.0008
          ? targetProgress
          : renderedProgress + difference * 0.18;

      const nextFrame = reducedMotion
        ? 1
        : Math.round(renderedProgress * (FRAME_SEQUENCE.totalFrames - 1)) + 1;

      if (nextFrame !== targetFrame) {
        direction = nextFrame > targetFrame ? 1 : -1;
        targetFrame = nextFrame;
        scheduleFrames(targetFrame);
      } else {
        drawNearestFrame(targetFrame);
      }

      const settled = Math.abs(targetProgress - renderedProgress) < 0.0008;
      commitProgress(timestamp, settled);

      if (!settled) motionFrame = window.requestAnimationFrame(runMotion);
    };

    const startMotion = () => {
      if (!motionFrame && isNearViewport && isPageVisible) {
        motionFrame = window.requestAnimationFrame(runMotion);
      }
    };

    const updateMeasurement = () => {
      measurementFrame = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
      targetProgress = clamp(-rect.top / scrollable);

      if (!hasMeasured) {
        hasMeasured = true;
        renderedProgress = targetProgress;
        targetFrame = reducedMotion
          ? 1
          : Math.round(renderedProgress * (FRAME_SEQUENCE.totalFrames - 1)) + 1;
        setProgress(renderedProgress);
        if (isNearViewport) scheduleFrames(targetFrame);
      }

      startMotion();
    };

    const requestMeasurement = () => {
      if (!measurementFrame) {
        measurementFrame = window.requestAnimationFrame(updateMeasurement);
      }
    };

    const handleResize = () => {
      setCanvasProfile();
      drawNearestFrame(targetFrame, true);
      requestMeasurement();
    };

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) {
        requestMeasurement();
        pumpQueue();
        startMotion();
      } else if (motionFrame) {
        window.cancelAnimationFrame(motionFrame);
        motionFrame = 0;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isNearViewport = entry.isIntersecting;
        if (isNearViewport) {
          requestMeasurement();
          scheduleFrames(targetFrame);
          startMotion();
        } else {
          queue = [];
          queued.clear();
          if (motionFrame) window.cancelAnimationFrame(motionFrame);
          motionFrame = 0;
        }
      },
      { rootMargin: '600px 0px' }
    );

    setCanvasProfile();
    observer.observe(section);

    window.addEventListener('scroll', requestMeasurement, { passive: true });
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('scroll', requestMeasurement);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (measurementFrame) window.cancelAnimationFrame(measurementFrame);
      if (motionFrame) window.cancelAnimationFrame(motionFrame);
      for (const image of pending.values()) image.src = '';
      for (const entry of cache.values()) releaseEntry(entry);
      pending.clear();
      cache.clear();
    };
  }, []);

  return { sectionRef, canvasRef, progress, isReady };
}

export function GpuComputeStory() {
  const { sectionRef, canvasRef, progress, isReady } = useFrameCanvas();
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
            className={`compute-story-canvas ${isReady ? 'is-ready' : ''}`}
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

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { mediaUrl } from '@/utils/media-url.js';

const loadHeroWireframeScene = () => import('./hero-wireframe-scene.jsx');
const HeroWireframeScene = lazy(loadHeroWireframeScene);

const HERO_BACKGROUNDS = {
  home: { src: '/media/hero_home.webp' },
  market: { src: '/media/hero_gpu.webp' },
  detail: { src: '/media/hero_gpu.webp' },
  enquiry: { src: '/media/hero_gpu.webp' },
  about: { src: '/media/hero_about.webp' },
  contact: { src: '/media/hero_contact.webp' },
  faq: { src: '/media/hero_home.webp' },
  thanks: { src: '/media/hero_home.webp' },
};

const clampNavigation = (value) => Math.min(1, Math.max(-1, value));
const TOUCH_DRAG_SENSITIVITY_X = 3.8;
const TOUCH_DRAG_SENSITIVITY_Y = 2.4;

function useInView() {
  const [node, setNode] = useState(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '180px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return [setNode, isInView];
}

function useDelayedWebglStart(isInView) {
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    if (!isInView || canStart) return undefined;

    let idleId;
    let settleTimer;
    let cancelled = false;

    const start = () => {
      if (!cancelled) setCanStart(true);
    };

    const scheduleAfterPaint = () => {
      settleTimer = window.setTimeout(() => {
        if (window.requestIdleCallback) {
          idleId = window.requestIdleCallback(start, { timeout: 3200 });
          return;
        }

        start();
      }, 1800);
    };

    if (document.readyState === 'complete') {
      scheduleAfterPaint();
    } else {
      window.addEventListener('load', scheduleAfterPaint, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', scheduleAfterPaint);
      window.clearTimeout(settleTimer);
      if (idleId) window.cancelIdleCallback?.(idleId);
    };
  }, [canStart, isInView]);

  return canStart;
}

function useIsMobile() {
  const getIsMobile = () =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    const update = () => setIsMobile(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isMobile;
}

export function HeroGpuVisual({ variant = 'home' }) {
  const [setNode, isInView] = useInView();
  const canStartWebgl = useDelayedWebglStart(isInView);
  const isMobile = useIsMobile();
  const [isSceneReady, setIsSceneReady] = useState(false);
  const visualRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const touchGestureRef = useRef(null);
  const scrollRef = useRef(0);
  const background = HERO_BACKGROUNDS[variant] || HERO_BACKGROUNDS.home;
  const backgroundSrc = mediaUrl(background.src, { width: isMobile ? 900 : 1920 });
  const [displaySrc, setDisplaySrc] = useState(backgroundSrc);
  const [panoramaSrc, setPanoramaSrc] = useState(background.src);
  const getHeroElement = () =>
    visualRef.current?.closest('.hero-panel, .public-cosmic-hero') ||
    document.querySelector('.hero-panel, .public-cosmic-hero');

  const setVisualNode = (node) => {
    visualRef.current = node;
    setNode(node);
  };

  useEffect(() => {
    if (!canStartWebgl) return;
    loadHeroWireframeScene();
  }, [canStartWebgl]);

  useEffect(() => {
    setDisplaySrc(backgroundSrc);
    setPanoramaSrc(background.src);
    setIsSceneReady(false);
  }, [background.src, backgroundSrc]);

  const syncCssCameraVars = (x, y) => {
    if (!visualRef.current) return;
    visualRef.current.style.setProperty('--hero-nav-x', x.toFixed(3));
    visualRef.current.style.setProperty('--hero-nav-y', y.toFixed(3));
    visualRef.current.style.setProperty('--hero-nav-depth', Math.min(1, Math.hypot(x, y)).toFixed(3));
  };

  const setNavigation = (x, y) => {
    const nextX = clampNavigation(x);
    const nextY = clampNavigation(y);

    pointerRef.current.x = nextX;
    pointerRef.current.y = nextY;
    syncCssCameraVars(nextX, nextY);
  };

  const updateNavigationFromPoint = (clientX, clientY, rect) => {
    const x = clampNavigation(((clientX - rect.left) / rect.width) * 2 - 1);
    const y = clampNavigation(-(((clientY - rect.top) / rect.height) * 2 - 1));

    setNavigation(x, y);
  };

  const resetNavigation = () => {
    touchGestureRef.current = null;
    setNavigation(0, 0);
  };

  useEffect(() => {
    const updateScroll = () => {
      const hero = getHeroElement();
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      const travel = Math.max(1, rect.height + window.innerHeight);
      scrollRef.current = THREELESS_CLAMP((window.innerHeight - rect.top) / travel, 0, 1);
    };

    const THREELESS_CLAMP = (value, min, max) => Math.min(max, Math.max(min, value));

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  useEffect(() => {
    const updatePointer = (event) => {
      if (event.pointerType === 'touch') return;

      const hero = getHeroElement();
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isInside) {
        resetNavigation();
        return;
      }

      updateNavigationFromPoint(event.clientX, event.clientY, rect);
    };

    const beginTouch = (event) => {
      const touch = event.touches[0];
      const hero = getHeroElement();
      if (!touch || !hero) return;

      const rect = hero.getBoundingClientRect();
      const isInside =
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom;

      if (isInside) {
        touchGestureRef.current = {
          startX: touch.clientX,
          startY: touch.clientY,
          baseX: pointerRef.current.x,
          baseY: pointerRef.current.y,
          width: Math.max(1, rect.width),
          height: Math.max(1, rect.height),
        };
      }
    };

    const updateTouch = (event) => {
      const touch = event.touches[0];
      if (!touch) return;

      if (!touchGestureRef.current) {
        beginTouch(event);
      }

      const gesture = touchGestureRef.current;
      if (!gesture) return;

      const dragX = ((touch.clientX - gesture.startX) / gesture.width) * TOUCH_DRAG_SENSITIVITY_X;
      const dragY = -((touch.clientY - gesture.startY) / gesture.height) * TOUCH_DRAG_SENSITIVITY_Y;

      setNavigation(gesture.baseX + dragX, gesture.baseY + dragY);
    };

    const endTouch = () => {
      if (touchGestureRef.current) {
        resetNavigation();
      }
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('touchstart', beginTouch, { passive: true });
    window.addEventListener('touchmove', updateTouch, { passive: true });
    window.addEventListener('touchend', endTouch, { passive: true });
    window.addEventListener('touchcancel', endTouch, { passive: true });
    return () => {
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('touchstart', beginTouch);
      window.removeEventListener('touchmove', updateTouch);
      window.removeEventListener('touchend', endTouch);
      window.removeEventListener('touchcancel', endTouch);
    };
  }, []);

  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch') return;

    const rect = event.currentTarget.getBoundingClientRect();
    updateNavigationFromPoint(event.clientX, event.clientY, rect);
  };

  const handlePointerLeave = () => {
    resetNavigation();
  };

  return (
    <div ref={setVisualNode} className={`hero-gpu-visual hero-gpu-visual-${variant}`} aria-hidden="true">
      <div className="hero-cosmic-composite">
        <img
          src={displaySrc}
          alt=""
          className="hero-bg-photo"
          decoding="async"
          fetchPriority={variant === 'home' ? 'high' : 'auto'}
          draggable="false"
          onLoad={() => {
            if (displaySrc !== background.src) {
              setPanoramaSrc(displaySrc);
            }
          }}
          onError={(event) => {
            if (event.currentTarget.dataset.fallbackLoaded) return;
            event.currentTarget.dataset.fallbackLoaded = 'true';
            const fallbackSrc = background.fallback || background.src;
            setDisplaySrc(fallbackSrc);
            setPanoramaSrc(fallbackSrc);
          }}
        />
        <div className="hero-depth-star-cluster hero-depth-star-cluster-a" />
        <div className="hero-depth-star-cluster hero-depth-star-cluster-b" />
        <div className="hero-depth-beacon hero-depth-beacon-a" />
        <div className="hero-depth-beacon hero-depth-beacon-b" />
        <div className="hero-depth-light-shard hero-depth-light-shard-a" />
        <div className="hero-depth-light-shard hero-depth-light-shard-b" />
        <div className="hero-depth-comet hero-depth-comet-a" />
        <div className="hero-depth-comet hero-depth-comet-b" />
        <div className="hero-aurora-curtain hero-aurora-curtain-a" />
        <div className="hero-aurora-curtain hero-aurora-curtain-b" />
      </div>
      <div className="hero-r3f-shell" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        {canStartWebgl ? (
          <Suspense fallback={<HeroSceneLoader />}>
            <HeroWireframeScene
              key={isMobile ? 'hero-wireframe-mobile' : 'hero-wireframe-desktop'}
              isMobile={isMobile}
              pointerRef={pointerRef}
              scrollRef={scrollRef}
              panoramaSrc={panoramaSrc}
              onReady={() => setIsSceneReady(true)}
            />
          </Suspense>
        ) : (
          <HeroSceneLoader />
        )}
        {canStartWebgl && !isSceneReady && <HeroSceneLoader overlay />}
      </div>
    </div>
  );
}

function HeroSceneLoader({ overlay = false }) {
  return <div className={`hero-r3f-loader ${overlay ? 'hero-r3f-loader-overlay' : ''}`} />;
}

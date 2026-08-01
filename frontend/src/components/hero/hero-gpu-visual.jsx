import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { SparkLoader } from '@/components/common/spark-loader.jsx';

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
  const isMobile = useIsMobile();
  const [isSceneReady, setIsSceneReady] = useState(false);
  const visualRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const background = HERO_BACKGROUNDS[variant] || HERO_BACKGROUNDS.home;
  const getHeroElement = () =>
    visualRef.current?.closest('.hero-panel, .public-cosmic-hero') ||
    document.querySelector('.hero-panel, .public-cosmic-hero');

  const setVisualNode = (node) => {
    visualRef.current = node;
    setNode(node);
  };

  useEffect(() => {
    loadHeroWireframeScene();
  }, []);

  const syncCssCameraVars = (x, y) => {
    if (!visualRef.current) return;
    visualRef.current.style.setProperty('--hero-nav-x', x.toFixed(3));
    visualRef.current.style.setProperty('--hero-nav-y', y.toFixed(3));
    visualRef.current.style.setProperty('--hero-nav-depth', Math.min(1, Math.hypot(x, y)).toFixed(3));
  };

  const updateNavigationFromPoint = (clientX, clientY, rect) => {
    const x = Math.min(1, Math.max(-1, ((clientX - rect.left) / rect.width) * 2 - 1));
    const y = Math.min(1, Math.max(-1, -(((clientY - rect.top) / rect.height) * 2 - 1)));

    pointerRef.current.x = x;
    pointerRef.current.y = y;
    syncCssCameraVars(x, y);
  };

  const resetNavigation = () => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
    syncCssCameraVars(0, 0);
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

    const updateTouch = (event) => {
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
        updateNavigationFromPoint(touch.clientX, touch.clientY, rect);
      }
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('touchstart', updateTouch, { passive: true });
    window.addEventListener('touchmove', updateTouch, { passive: true });
    window.addEventListener('touchend', resetNavigation, { passive: true });
    window.addEventListener('touchcancel', resetNavigation, { passive: true });
    return () => {
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('touchstart', updateTouch);
      window.removeEventListener('touchmove', updateTouch);
      window.removeEventListener('touchend', resetNavigation);
      window.removeEventListener('touchcancel', resetNavigation);
    };
  }, []);

  const handlePointerMove = (event) => {
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
          src={background.src}
          alt=""
          className="hero-bg-photo"
          decoding="async"
          draggable="false"
          onError={(event) => {
            if (!background.fallback || event.currentTarget.dataset.fallbackLoaded) return;
            event.currentTarget.dataset.fallbackLoaded = 'true';
            event.currentTarget.src = background.fallback;
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
        {isInView ? (
          <Suspense fallback={<HeroSceneLoader />}>
            <HeroWireframeScene
              key={isMobile ? 'hero-wireframe-mobile' : 'hero-wireframe-desktop'}
              isMobile={isMobile}
              pointerRef={pointerRef}
              scrollRef={scrollRef}
              panoramaSrc={background.src}
              onReady={() => setIsSceneReady(true)}
            />
          </Suspense>
        ) : (
          <HeroSceneLoader />
        )}
        {!isSceneReady && <HeroSceneLoader overlay />}
      </div>
    </div>
  );
}

function HeroSceneLoader({ overlay = false }) {
  return (
    <div className={`hero-r3f-loader ${overlay ? 'hero-r3f-loader-overlay' : ''}`}>
      <SparkLoader label="Loading GPU universe" fullScreen={false} />
    </div>
  );
}

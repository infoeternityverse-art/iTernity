import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const HeroWireframeScene = lazy(() => import('./hero-wireframe-scene.jsx'));

function useInView() {
  const [node, setNode] = useState(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!node) return undefined;

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    const update = () => setIsMobile(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isMobile;
}

export function HeroGpuVisual() {
  const [setNode, isInView] = useInView();
  const isMobile = useIsMobile();
  const pointerRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const updateScroll = () => {
      const hero = document.querySelector('.hero-panel');
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
      const hero = document.querySelector('.hero-panel');
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isInside) {
        pointerRef.current.x = 0;
        pointerRef.current.y = 0;
        return;
      }

      pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerRef.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    return () => window.removeEventListener('pointermove', updatePointer);
  }, []);

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerRef.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const handlePointerLeave = () => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
  };

  return (
    <div ref={setNode} className="hero-gpu-visual" aria-hidden="true">
      <div className="hero-cosmic-composite">
        <div className="hero-aurora-curtain hero-aurora-curtain-a" />
        <div className="hero-aurora-curtain hero-aurora-curtain-b" />
        <div className="hero-aurora-reflection" />
        <div className="hero-aurora-horizon" />
        <div className="hero-aurora-shore hero-aurora-shore-left" />
        <div className="hero-aurora-shore hero-aurora-shore-right" />
        <div className="hero-cosmic-lens hero-cosmic-lens-a" />
        <div className="hero-cosmic-lens hero-cosmic-lens-b" />
        <div className="hero-cosmic-warp" />
        <div className="hero-cosmic-scan" />
      </div>
      <div className="hero-r3f-shell" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        {isInView ? (
          <Suspense fallback={<div className="hero-r3f-fallback" />}>
            <HeroWireframeScene isMobile={isMobile} pointerRef={pointerRef} scrollRef={scrollRef} />
          </Suspense>
        ) : (
          <div className="hero-r3f-fallback" />
        )}
      </div>
    </div>
  );
}

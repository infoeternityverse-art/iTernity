import { lazy, Suspense, useEffect, useState } from 'react';

const HeroConstellationScene = lazy(() => import('./hero-constellation-scene.jsx'));

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return isMobile;
}

function FallbackVisual() {
  return (
    <div className="hero-constellation-fallback" aria-hidden="true">
      {Array.from({ length: 28 }, (_, index) => (
        <span key={index} />
      ))}
      <i />
    </div>
  );
}

export function HeroGpuVisual() {
  const isMobile = useIsMobile();

  return (
    <div className="hero-gpu-visual" aria-hidden="true">
      <div className="hero-constellation-canvas">
        <Suspense fallback={<FallbackVisual />}>
          <HeroConstellationScene isMobile={isMobile} />
        </Suspense>
      </div>
    </div>
  );
}

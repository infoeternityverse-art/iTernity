import { useEffect, useRef } from 'react';

export function CursorDot() {
  const dotRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    const shouldDisable =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (shouldDisable) return undefined;

    const dot = dotRef.current;
    if (!dot) return undefined;

    const tick = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.22;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.22;
      dot.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)`;

      const distance = Math.hypot(
        targetRef.current.x - currentRef.current.x,
        targetRef.current.y - currentRef.current.y
      );
      frameRef.current = distance > 0.1 ? window.requestAnimationFrame(tick) : 0;
    };

    const handlePointerMove = (event) => {
      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;
      dot.classList.add('is-visible');
      if (!frameRef.current) frameRef.current = window.requestAnimationFrame(tick);

      const hoverSurface = event.target.closest?.(
        '.rounded-card, .cosmic-hover-card, .cursor-spotlight-card, .blog-card, .blog-article-hero, .blog-article-body, .blog-article-sidebar, .blog-article-share'
      );
      if (hoverSurface) {
        const rect = hoverSurface.getBoundingClientRect();
        hoverSurface.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        hoverSurface.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      }
    };

    const handlePointerDown = () => dot.classList.add('is-pressed');
    const handlePointerUp = () => dot.classList.remove('is-pressed');
    const handlePointerLeave = () => dot.classList.remove('is-visible');

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.documentElement.addEventListener('mouseleave', handlePointerLeave);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave);
      window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}

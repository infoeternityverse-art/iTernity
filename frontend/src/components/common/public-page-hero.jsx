import { HeroGpuVisual } from '@/components/hero/hero-gpu-visual.jsx';

const WEBGL_HERO_VARIANTS = new Set(['market', 'about', 'contact']);

export function PublicPageHero({ eyebrow, title, description, variant = 'aurora', children }) {
  const shouldRenderWebglHero = WEBGL_HERO_VARIANTS.has(variant);

  return (
    <section className={`public-cosmic-hero public-cosmic-hero-${variant}`}>
      {shouldRenderWebglHero && <HeroGpuVisual variant={variant} />}
      <div className="public-cosmic-hero-stars" />
      <div className="public-cosmic-hero-glow" />
      <div className="public-cosmic-hero-orbit" />
      <div className="public-cosmic-hero-content">
        {eyebrow && <p className="public-cosmic-hero-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="public-cosmic-hero-description">{description}</p>}
        {children && <div className="public-cosmic-hero-actions">{children}</div>}
      </div>
    </section>
  );
}

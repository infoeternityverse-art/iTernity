import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';

const nodes = [
  { label: 'Train', className: 'gpu-observatory-node-train' },
  { label: 'Infer', className: 'gpu-observatory-node-infer' },
  { label: 'Render', className: 'gpu-observatory-node-render' },
  { label: 'Create', className: 'gpu-observatory-node-create' },
];

export function GpuObservatoryHero() {
  const reduceMotion = useReducedMotion();
  const scrollToSection = (event, sectionId) => {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <section className="gpu-observatory-hero" aria-labelledby="gpu-observatory-title">
      <div className="gpu-observatory-grid" aria-hidden="true" />
      <div className="gpu-observatory-beam" aria-hidden="true" />

      <motion.div
        className="gpu-observatory-copy"
        initial={reduceMotion ? false : { opacity: 0, y: 34, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="gpu-observatory-kicker">
          <span>01</span>
          <p>Compute observatory</p>
        </div>
        <h1 id="gpu-observatory-title">
          Find the compute
          <span>your work can become.</span>
        </h1>
        <p className="gpu-observatory-intro">
          Explore accelerated infrastructure through the workload it unlocks, with the
          specifications, availability, and access path made clear before you commit.
        </p>
        <div className="gpu-observatory-actions">
          <a
            href="#gpu-inventory"
            className="gpu-observatory-primary"
            onClick={(event) => scrollToSection(event, 'gpu-inventory')}
          >
            Enter the inventory <ArrowDown />
          </a>
          <a
            href="#gpu-match"
            className="gpu-observatory-secondary"
            onClick={(event) => scrollToSection(event, 'gpu-match')}
          >
            Match my workload <ArrowRight />
          </a>
        </div>
      </motion.div>

      <motion.div
        className="gpu-observatory-map"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 640 640" role="presentation">
          <circle className="gpu-observatory-ring ring-one" cx="320" cy="320" r="118" />
          <circle className="gpu-observatory-ring ring-two" cx="320" cy="320" r="202" />
          <circle className="gpu-observatory-ring ring-three" cx="320" cy="320" r="282" />
          <path className="gpu-observatory-path path-one" d="M104 208C204 80 427 82 538 214" />
          <path className="gpu-observatory-path path-two" d="M92 420C214 558 454 550 556 389" />
          <path className="gpu-observatory-path path-three" d="M205 82C514 152 515 484 228 557" />
          <line className="gpu-observatory-axis" x1="38" x2="602" y1="320" y2="320" />
          <line className="gpu-observatory-axis" x1="320" x2="320" y1="38" y2="602" />
        </svg>

        <div className="gpu-observatory-core">
          <span className="gpu-observatory-core-grid" />
          <strong>GPU</strong>
          <small>ACCELERATED</small>
        </div>

        {nodes.map((node, index) => (
          <div key={node.label} className={`gpu-observatory-node ${node.className}`}>
            <span />
            <p>{node.label}</p>
            <small>0{index + 1}</small>
          </div>
        ))}
      </motion.div>

      <div className="gpu-observatory-status" aria-label="Marketplace principles">
        <span>Workload first</span>
        <span>Specifications visible</span>
        <span>Reviewed access</span>
      </div>
    </section>
  );
}

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion';
import { ArrowRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { AboutComputeScene } from '@/components/about/about-compute-scene.jsx';
import { Seo } from '@/components/common/seo.jsx';
import { createBreadcrumbSchema } from '@/utils/seo-schema.js';

const storyChapters = [
  {
    number: '01',
    label: 'Why we exist',
    title: 'Ambition should meet infrastructure without losing momentum.',
    body: 'iTernityverse is building a clearer path between a serious workload and the compute it deserves. Less ambiguity before access. More confidence in what comes next.',
    alignment: 'left',
  },
  {
    number: '02',
    label: 'How we think',
    title: 'A catalog can list GPUs. It cannot understand the work.',
    body: 'Models, rendering pipelines, inference systems, and experiments ask different things of infrastructure. We start with the workload, then shape the route to compute around it.',
    alignment: 'right',
  },
  {
    number: '03',
    label: 'How we operate',
    title: 'Remove uncertainty before it becomes operational drag.',
    body: 'Clear specifications, reviewed enquiries, deliberate recommendations, and composed handoffs keep teams focused on the work rather than the machinery around it.',
    alignment: 'left',
  },
  {
    number: '04',
    label: 'What we protect',
    title: 'Access is a responsibility, not a checkout event.',
    body: 'Trust is designed into the journey: thoughtful review, careful handling, explicit next steps, and infrastructure access that never feels casual.',
    alignment: 'right',
  },
];

const principles = [
  ['Clarity', 'Make the important details understandable before commitment.'],
  ['Fit', 'Match infrastructure to the shape of the workload, not the loudest specification.'],
  ['Care', 'Treat access, credentials, and handoffs with operational seriousness.'],
  ['Momentum', 'Keep capable teams moving without turning urgency into pressure.'],
];

const reveal = {
  hidden: { opacity: 0, y: 34, filter: 'blur(12px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export function AboutPage() {
  const storyRef = useRef(null);
  const sceneProgress = useRef(0);
  const reduceMotion = useReducedMotion();
  const storyInView = useInView(storyRef, { margin: '180px 0px' });
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    sceneProgress.current = latest;
  });

  return (
    <div className="about-cinematic">
      <Seo
        title="About iTernityverse"
        description="Meet iTernityverse: a clearer, more deliberate path to GPU infrastructure for AI, research, inference, rendering, and ambitious compute workloads."
        path="/about"
        structuredData={[
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />

      <section ref={storyRef} className="about-story" aria-label="The iTernityverse story">
        <div className="about-story-stage" aria-hidden="true">
          <div className="about-story-halo" />
          {!reduceMotion ? (
            <AboutComputeScene progressRef={sceneProgress} active={storyInView} />
          ) : (
            <div className="about-static-processor">
              <span />
            </div>
          )}
          <div className="about-story-vignette" />
          <div className="about-story-grain" />
          <div className="about-stage-index">ITV / ORIGIN</div>
        </div>

        <div className="about-story-copy">
          <header className="about-opening about-story-panel">
            <motion.div
              initial={reduceMotion ? false : 'hidden'}
              animate="visible"
              variants={reveal}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="about-opening-inner"
            >
              <p className="about-kicker">About iTernityverse</p>
              <h1>
                Compute should
                <span>accelerate conviction.</span>
              </h1>
              <p className="about-opening-summary">
                We are creating a more considered way for ambitious teams to understand,
                approach, and access accelerated infrastructure.
              </p>
              <a className="about-scroll-cue" href="#about-purpose">
                <span>Enter our story</span>
                <span className="about-scroll-line" />
              </a>
            </motion.div>
          </header>

          {storyChapters.map((chapter, index) => (
            <article
              id={index === 0 ? 'about-purpose' : undefined}
              key={chapter.number}
              className={`about-story-panel about-story-panel-${chapter.alignment}`}
            >
              <motion.div
                className="about-chapter"
                initial={reduceMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={{ amount: 0.56, once: false }}
                variants={reveal}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="about-chapter-meta">
                  <span>{chapter.number}</span>
                  <span>{chapter.label}</span>
                </div>
                <h2>{chapter.title}</h2>
                <p>{chapter.body}</p>
              </motion.div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-principles" aria-labelledby="about-principles-title">
        <motion.div
          className="about-principles-heading"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={reveal}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="about-kicker">The standard we hold</p>
          <h2 id="about-principles-title">The quiet architecture behind every decision.</h2>
        </motion.div>

        <div className="about-principles-list">
          {principles.map(([title, description], index) => (
            <motion.article
              key={title}
              initial={reduceMotion ? false : { opacity: 0, x: index % 2 ? 26 : -26 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 0.65, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="about-direction" aria-labelledby="about-direction-title">
        <div className="about-direction-orbit" aria-hidden="true">
          <span />
          <span />
          <ShieldCheck />
        </div>
        <motion.div
          className="about-direction-copy"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={reveal}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="about-kicker">Where we are going</p>
          <h2 id="about-direction-title">A dependable front door to the next era of compute.</h2>
          <p>
            iTernityverse is growing toward an ecosystem where discovering the right
            infrastructure feels precise, gaining access feels considered, and moving from idea
            to execution feels natural.
          </p>
          <div className="about-direction-actions">
            <Link to="/gpus" className="about-primary-link">
              Explore infrastructure <ArrowRight />
            </Link>
            <Link to="/contact" className="about-secondary-link">
              Start a conversation <ArrowUpRight />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

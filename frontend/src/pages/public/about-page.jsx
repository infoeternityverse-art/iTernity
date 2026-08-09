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
import { createAboutPageSchema, createBreadcrumbSchema } from '@/utils/seo-schema.js';

const ABOUT_DESCRIPTION =
  'Learn how iTernityverse helps AI teams discover and access suitable, reliable GPU infrastructure for training, inference, fine-tuning, rendering, research, and development.';

const storyChapters = [
  {
    number: '02',
    label: 'Why we exist',
    title: 'Your work should not wait for the right infrastructure.',
    paragraphs: [
      'AI development moves quickly. Training, inference, fine-tuning, rendering, and experimentation all require different levels of compute.',
      'iTernityverse helps teams find suitable GPU infrastructure for their workloads, so they can spend less time figuring out where to run their work and more time building it.',
    ],
    alignment: 'left',
  },
  {
    number: '03',
    label: 'How we think',
    title: 'The right GPU is about more than specifications.',
    paragraphs: [
      'A GPU should match the workload, not just look powerful on a specification sheet.',
      'We look at what you are actually trying to run \u2014 from model training and inference to development, rendering, and research \u2014 and help you choose infrastructure that fits the job.',
    ],
    closing: 'Clear requirements. Suitable compute. Straightforward access.',
    alignment: 'right',
  },
  {
    number: '04',
    label: 'How we operate',
    title: 'Make compute easier to access.',
    paragraphs: [
      'From choosing the right GPU configuration to getting your environment ready, we aim to remove the friction between your workload and the infrastructure behind it.',
      'We focus on clear options, practical recommendations, reliable provisioning, and the tools teams need to get started.',
    ],
    alignment: 'left',
  },
  {
    number: '05',
    label: 'What we protect',
    title: 'Compute access should be reliable, secure, and considered.',
    paragraphs: [
      'GPU infrastructure is more than hardware. It is where models, applications, data, and important workloads run.',
      'That is why we care about controlled access, secure credentials, clear workspace information, and dependable infrastructure throughout the customer journey.',
    ],
    alignment: 'right',
  },
];

const principles = [
  ['Clarity', 'Make GPU options, pricing, specifications, and access easy to understand.'],
  ['Fit', 'Match infrastructure to the workload instead of simply choosing the biggest GPU.'],
  ['Reliability', 'Provide dependable compute environments teams can build and work on with confidence.'],
  ['Access', 'Make getting started with GPU infrastructure simple, secure, and straightforward.'],
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
        title="About iTernityverse | GPU Infrastructure for AI Teams"
        description={ABOUT_DESCRIPTION}
        path="/about"
        image="/media/hero_about.webp"
        structuredData={[
          createAboutPageSchema({ description: ABOUT_DESCRIPTION }),
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
              <p className="about-kicker">01 &mdash; About iTernityverse</p>
              <h1>
                Compute should move
                <span>at the speed of your work.</span>
              </h1>
              <p className="about-opening-summary">
                iTernityverse makes high-performance GPU infrastructure easier to discover,
                access, and use &mdash; giving AI teams the compute they need without unnecessary
                complexity.
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
                {chapter.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {chapter.closing && (
                  <strong className="about-chapter-closing">{chapter.closing}</strong>
                )}
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
          <p className="about-kicker">06 &mdash; The standard we hold</p>
          <h2 id="about-principles-title">The principles behind every compute decision.</h2>
        </motion.div>

        <dl className="about-principles-list">
          {principles.map(([title, description], index) => (
            <motion.div
              key={title}
              initial={reduceMotion ? false : { opacity: 0, x: index % 2 ? 26 : -26 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 0.65, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <span aria-hidden="true">0{index + 1}</span>
              <dt>{title}</dt>
              <dd>{description}</dd>
            </motion.div>
          ))}
        </dl>
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
          <p className="about-kicker">07 &mdash; Where we are going</p>
          <h2 id="about-direction-title">
            A simpler way to access the compute behind what comes next.
          </h2>
          <p>
            iTernityverse is building toward a more accessible GPU infrastructure ecosystem
            &mdash; where teams can discover suitable compute, provision the right environment,
            and move from an idea to execution with less friction.
          </p>
          <p>
            Whether you are training a model, running inference, developing an AI application,
            rendering, or experimenting with new workloads, the goal is simple:
          </p>
          <strong className="about-direction-closing">
            Give ambitious teams the compute to keep moving.
          </strong>
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

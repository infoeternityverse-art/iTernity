import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle, Cpu, KeyRound, MessageSquare, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/index.js';
import { HeroGpuVisual } from '@/components/hero/hero-gpu-visual.jsx';
import { GpuComputeStory } from '@/components/home/gpu-compute-story.jsx';
import { Seo } from '@/components/common/seo.jsx';
import { createOrganizationSchema, createWebsiteSchema } from '@/utils/seo-schema.js';

const features = [
  {
    number: '01',
    label: 'COMPARE',
    title: 'Curated GPU Rentals',
    description:
      'Compare practical GPU packages by VRAM, CPU, RAM, storage, price, and region without losing sight of workload fit.',
    highlights: [
      'Transparent package specs for quick evaluation',
      'Region and capacity details in one place',
      'Balanced choices for inference, training, and rendering',
    ],
    icon: Cpu,
  },
  {
    number: '02',
    label: 'REVIEW',
    title: 'Human Reviewed Access',
    description:
      'Submit your project requirements and receive the right setup after admin review and approval.',
    highlights: [
      'Manual fit checks for every request',
      'Clear handoff from enquiry to provisioning',
      'Support for safer enterprise access control',
    ],
    icon: ShieldCheck,
  },
  {
    number: '03',
    label: 'DELIVER',
    title: 'Credentials In Dashboard',
    description:
      'Approved customers can later access issued credentials from their account area without chasing email threads.',
    highlights: [
      'Centralized access after approval',
      'Simple retrieval of credentials and workspace details',
      'Cleaner post-approval handoff for teams',
    ],
    icon: KeyRound,
  },
];

const howItWorksSteps = [
  {
    number: '01',
    label: 'DISCOVER',
    title: 'Explore GPU Infrastructure',
    description:
      'Browse enterprise GPU clusters designed for AI training, inference, rendering, simulation, and high-performance workloads.',
    icon: Cpu,
  },
  {
    number: '02',
    label: 'CONFIGURE',
    title: 'Customize Your Deployment',
    description:
      'Select the GPU series, operating system, storage, networking, software stack, and rental duration that fit your project.',
    icon: MessageSquare,
  },
  {
    number: '03',
    label: 'VALIDATE',
    title: 'Infrastructure Review',
    description:
      'Our team checks the request, confirms resource fit, and validates the environment before deployment begins.',
    icon: ShieldCheck,
  },
  {
    number: '04',
    label: 'PROVISION',
    title: 'Environment Provisioning',
    description:
      'Dedicated infrastructure is securely configured, benchmarked, and prepared for your approved workload.',
    icon: KeyRound,
  },
  {
    number: '05',
    label: 'LAUNCH',
    title: 'Access Your Workspace',
    description:
      'Receive secure credentials and start working with JupyterLab, SSH, APIs, and the rest of your GPU workspace.',
    icon: CheckCircle,
  },
];

function createFadeInMotion(reduceMotion, direction = 'left', delay = 0) {
  if (reduceMotion) {
    return {
      initial: false,
      whileInView: { opacity: 1, x: 0, y: 0 },
      viewport: { once: true, amount: 0.3 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, x: direction === 'left' ? -32 : 32, y: 18 },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.65, delay, ease: 'easeOut' },
  };
}

function ScrollIndicator() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const update = () => setIsHidden(window.scrollY > window.innerHeight * 0.9);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className={`hero-scroll-indicator ${isHidden ? 'is-hidden' : ''}`} aria-hidden="true">
      <span />
      <p>SCROLL TO DISCOVER</p>
    </div>
  );
}

export function HomePage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-16">
      <Seo
        title="iTernityverse | Cloud GPU Rental for AI Teams"
        description="Rent curated cloud GPU packages for AI inference, model training, rendering, research, and creative workloads with reviewed access."
        path="/"
        structuredData={[createOrganizationSchema(), createWebsiteSchema()]}
      />
      <section className="hero-panel relative left-1/2 -ml-[50vw] -mt-12 flex min-h-screen w-screen max-w-[100vw] items-center overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32">
        <div className="hero-panel-grid pointer-events-none absolute inset-0" />
        <div className="hero-panel-dust pointer-events-none absolute inset-0" />
        <HeroGpuVisual variant="home" />
        <ScrollIndicator />

        <div className="hero-content-grid mx-auto w-full max-w-7xl">
          <div className="hero-copy relative z-10 text-center">
            <div className="hero-copy-inner">
              {/* <p className="hero-eyebrow"><span />GPU CLOUD</p> */}
              <h1 className="hero-heading">
                <span className="hero-heading-line hero-heading-line-1" data-text="Enter the">
                  Enter the
                </span>
                <span className="hero-heading-line hero-heading-line-2" data-text="GPU universe">
                  GPU universe
                </span>
                <span className="hero-heading-line hero-heading-line-3" data-text="for modern AI.">
                  for modern AI.
                </span>
              </h1>
              <p className="hero-typing-line">
                Rendering intelligence across a living cosmic compute field
              </p>
              <div className="hero-action-cluster">
                {/* <Button asChild className="hero-cta-button pointer-events-auto">
                  <Link to="/gpus">
                    Explore GPUs
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <p>live capacity / curated access / cosmic-scale workloads</p> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <GpuComputeStory />

      <section
        className="rounded-[40px] bg-[#0E1310]/88 p-4 shadow-soft backdrop-blur-xl sm:p-6 lg:p-8"
        aria-labelledby="features-title how-it-works-title"
      >
        <div className="relative overflow-hidden rounded-[34px] bg-[#0E1310]/88 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,232,196,0.05),transparent_70%)]" />

          <section
            id="features"
            aria-labelledby="features-title"
            aria-describedby="features-description"
            className="relative z-10 py-8 sm:py-10 lg:py-12"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            <motion.header
              className="mx-auto max-w-4xl rounded-[28px] border border-[rgba(45,232,196,0.15)] bg-[#0E1310]/88 px-6 py-7 text-center shadow-soft backdrop-blur-xl sm:px-8 sm:py-8"
              {...createFadeInMotion(reduceMotion, 'left', 0)}
            >
              <p className="text-xs font-bold tracking-[0.5em] text-[#2DE8C4]">FEATURES</p>
              <h2
                id="features-title"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#F5F7F6] sm:text-4xl lg:text-5xl"
              >
                Built for practical GPU workflow clarity
              </h2>
              <p
                id="features-description"
                className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[#8FA39B] sm:text-base"
              >
                Compare specs, review access paths, and keep credential delivery organized with a
                section that reads cleanly and feels open, modern, and easy to scan.
              </p>
            </motion.header>

            <div className="relative z-10 mt-12 grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const direction = index % 2 === 0 ? 'left' : 'right';
                const spanClass = ['lg:col-span-5', 'lg:col-span-4', 'lg:col-span-3'][index];
                const offsetClass = ['lg:translate-y-0', 'lg:translate-y-10', 'lg:translate-y-0'][index];

                return (
                  <motion.article
                    key={feature.title}
                    className={`group relative overflow-hidden rounded-[32px] border border-[rgba(45,232,196,0.15)] bg-[#0E1310]/88 px-6 py-7 shadow-soft backdrop-blur-xl sm:px-7 sm:py-8 ${spanClass} ${offsetClass}`}
                    {...createFadeInMotion(reduceMotion, direction, index * 0.1)}
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                  >
                    <meta itemProp="position" content={`${index + 1}`} />
                    <meta itemProp="name" content={feature.title} />
                    <meta itemProp="description" content={feature.description} />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-2 select-none text-[110px] font-black leading-none text-[#2DE8C4] opacity-[0.08] sm:text-[120px]"
                    >
                      {feature.number}
                    </div>

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="mb-8 flex items-center justify-between gap-4">
                        <span className="inline-flex rounded-full bg-white/[0.035] px-3 py-1 text-xs font-bold tracking-[0.35em] text-[#2DE8C4]">
                          {feature.label}
                        </span>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(45,232,196,0.08)] text-[#2DE8C4] shadow-[0_0_28px_rgba(45,232,196,0.18)]">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      <h3 className="max-w-md text-2xl font-semibold tracking-tight text-[#F5F7F6] sm:text-[2rem]">
                        {feature.title}
                      </h3>
                      <p className="mt-4 max-w-lg text-sm leading-7 text-[#8FA39B] sm:text-base">
                        {feature.description}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-3">
                        {feature.highlights.map((highlight) => (
                          <div
                            key={highlight}
                            className="inline-flex items-start gap-2 text-sm leading-6 text-[#A0AEC0]"
                          >
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#2DE8C4] drop-shadow-[0_0_10px_rgba(45,232,196,0.35)]" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>

          <div className="relative z-10 mt-10 h-px bg-gradient-to-r from-transparent via-[#2DE8C4]/18 to-transparent" />

          <section
            className="relative z-10 py-12 sm:py-14 lg:py-16"
            aria-labelledby="how-it-works-title"
            aria-describedby="how-it-works-description"
            itemScope
            itemType="https://schema.org/HowTo"
          >
            <motion.header
              className="mx-auto max-w-4xl rounded-[28px] border border-[rgba(45,232,196,0.15)] bg-[#0E1310]/88 px-6 py-7 text-center shadow-soft backdrop-blur-xl sm:px-8 sm:py-8"
              {...createFadeInMotion(reduceMotion, 'right', 0)}
            >
              <p className="text-xs font-bold tracking-[0.5em] text-[#2DE8C4]">ITERNITYVERSE</p>
              <h2
                id="how-it-works-title"
                className="mt-4 text-3xl font-semibold tracking-tight text-[#F5F7F6] sm:text-4xl lg:text-5xl"
              >
                How It Works
              </h2>
              <p
                id="how-it-works-description"
                className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[#8FA39B] sm:text-base"
              >
                From discovery to deployment, the workflow stays structured so every step is easy
                to follow, but the layout stays open and airy.
              </p>
            </motion.header>

            <div className="relative mt-14">
              <svg
                className="pointer-events-none absolute left-0 top-4 hidden h-[360px] w-full lg:block"
                viewBox="0 0 1200 360"
                fill="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M 80 88 C 220 88, 260 88, 360 88 S 560 280, 650 280 S 840 88, 960 88 S 1080 180, 1140 180"
                  stroke="url(#timelineGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="10 14"
                  initial={reduceMotion ? false : { pathLength: 0, opacity: 0.6 }}
                  whileInView={reduceMotion ? {} : { pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.8, ease: 'easeInOut' }}
                />
                <defs>
                  <linearGradient id="timelineGradient" x1="0" y1="0" x2="1200" y2="0">
                    <stop offset="0%" stopColor="#2DE8C4" stopOpacity="0.15" />
                    <stop offset="45%" stopColor="#2DE8C4" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0D3B3E" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
              </svg>

              <ol className="relative z-10 grid gap-6 lg:grid-cols-5 lg:gap-4" itemProp="step">
                {howItWorksSteps.map((step, index) => {
                  const Icon = step.icon;
                  const direction = index % 2 === 0 ? 'left' : 'right';
                  const stepOffsetClass = ['lg:mt-0', 'lg:mt-20', 'lg:mt-6', 'lg:mt-24', 'lg:mt-12'][index];

                  return (
                    <li
                      key={step.number}
                      className={`relative ${stepOffsetClass}`}
                      itemProp="step"
                      itemScope
                      itemType="https://schema.org/HowToStep"
                    >
                      <motion.div {...createFadeInMotion(reduceMotion, direction, index * 0.08)}>
                        <div className="relative rounded-[28px] bg-[#0E1310]/88 px-5 py-6 backdrop-blur-xl sm:px-6 sm:py-7">
                          <meta itemProp="position" content={`${index + 1}`} />
                          <meta itemProp="name" content={step.title} />
                          <meta itemProp="description" content={step.description} />

                          <div className="mb-5 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(45,232,196,0.08)] text-[#2DE8C4] shadow-[0_0_24px_rgba(45,232,196,0.18)]">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="inline-flex rounded-full bg-white/[0.035] px-3 py-1 text-xs font-bold tracking-[0.35em] text-[#2DE8C4]">
                              {step.number}
                            </div>
                          </div>

                          <h3 className="text-2xl font-semibold tracking-tight text-[#F5F7F6]">
                            {step.title}
                          </h3>
                          <p className="mt-4 max-w-md text-sm leading-7 text-[#8FA39B]">
                            {step.description}
                          </p>

                          <div className="mt-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.35em] text-[#A0AEC0]">
                            <span className="h-px w-8 bg-[#2DE8C4]/35" />
                            {step.label}
                          </div>

                          <div className="absolute inset-0 -z-10 rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(45,232,196,0.08),transparent_55%)]" />
                        </div>
                      </motion.div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        </div>
      </section>

      <section
        className="rounded-[32px] bg-[#0E1310]/88 p-4 shadow-soft backdrop-blur-xl sm:p-6 lg:p-8"
        aria-labelledby="why-choose-us-title"
      >
        <div className="relative overflow-hidden rounded-[34px] bg-[#0E1310]/88 px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,232,196,0.04),transparent_70%)]" />
          <div className="relative z-10 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
            <motion.div {...createFadeInMotion(reduceMotion, 'left', 0)}>
              <p className="text-xs font-bold tracking-[0.5em] text-[#2DE8C4]">WHY CHOOSE US</p>
              <h2
                id="why-choose-us-title"
                className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-[#F5F7F6] sm:text-4xl lg:text-5xl"
              >
                The experience feels guided, precise, and easy to trust.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#8FA39B] sm:text-base">
                We keep the journey clear from the first comparison through the final handoff,
                using spacing and depth instead of hard borders or stacked boxes.
              </p>

              <div className="mt-10 space-y-6">
                {[
                  {
                    title: 'Transparent specs',
                    text: 'Every package is presented with enough detail to compare confidently.',
                  },
                  {
                    title: 'Manual review',
                    text: 'Requests are checked by a person so the setup matches the workload.',
                  },
                  {
                    title: 'Clean handoff',
                    text: 'Credentials and workspace details are delivered in one clear place.',
                  },
                ].map((item, index) => (
                  <div key={item.title} className="group flex items-start gap-5">
                    <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgba(45,232,196,0.08)] text-sm font-bold text-[#2DE8C4] shadow-[0_0_24px_rgba(45,232,196,0.15)]">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#F5F7F6]">{item.title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-7 text-[#8FA39B] sm:text-base">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...createFadeInMotion(reduceMotion, 'right', 0.08)}>
              <div className="relative overflow-hidden rounded-[30px] bg-[rgba(13,27,30,0.4)] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-[16px] sm:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,232,196,0.08),transparent_50%)]" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold tracking-[0.5em] text-[#2DE8C4]">
                        READY TO START
                      </p>
                      <h3 className="mt-4 text-2xl font-semibold text-[#F5F7F6]">
                        Match your workload to the right GPU package
                      </h3>
                    </div>
                    <MessageSquare className="h-8 w-8 shrink-0 text-[#2DE8C4] drop-shadow-[0_0_16px_rgba(45,232,196,0.35)]" />
                  </div>

                  <p className="text-sm leading-7 text-[#8FA39B]">
                    Start with the marketplace, compare the options, and submit an enquiry from
                    the package that best fits your project goals.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-[#F5F7F6]">
                      <CheckCircle className="h-5 w-5 text-[#2DE8C4]" />
                      Reviewed access
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#F5F7F6]">
                      <CheckCircle className="h-5 w-5 text-[#2DE8C4]" />
                      Structured handoff
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#F5F7F6]">
                      <CheckCircle className="h-5 w-5 text-[#2DE8C4]" />
                      Support for AI workloads
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full border-0 bg-[linear-gradient(135deg,#2DE8C4_0%,#18C8A2_100%)] font-bold text-[#060907] shadow-[0_10px_28px_rgba(45,232,196,0.22)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(45,232,196,0.34)]"
                  >
                    <Link to="/gpus">Find a GPU package</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

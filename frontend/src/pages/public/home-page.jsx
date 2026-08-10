import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Cpu,
  KeyRound,
  MessageSquare,
  PackageCheck,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { Button, Card } from '@/components/ui/index.js';
import { HeroGpuVisual } from '@/components/hero/hero-gpu-visual.jsx';
import { GpuComputeStory } from '@/components/home/gpu-compute-story.jsx';
import { Seo } from '@/components/common/seo.jsx';
import { createOrganizationSchema, createWebsiteSchema } from '@/utils/seo-schema.js';

const features = [
  {
    number: '01',
    label: 'COMPARE',
    title: 'Curated GPU Rentals',
    media: '/media/hero_gpu.webp',
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
    media: '/media/hero_about.webp',
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
    media: '/media/hero_contact.webp',
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
    media: '/media/step1.webp',
    description:
      'Browse enterprise GPU clusters designed for AI training, inference, rendering, simulation, and high-performance workloads.',
    icon: Cpu,
  },
  {
    number: '02',
    label: 'CONFIGURE',
    title: 'Customize Your Deployment',
    media: '/media/step2.webp',
    description:
      'Select the GPU series, operating system, storage, networking, software stack, and rental duration that fit your project.',
    icon: MessageSquare,
  },
  {
    number: '03',
    label: 'VALIDATE',
    title: 'Infrastructure Review',
    media: '/media/step3.webp',
    description:
      'Our team checks the request, confirms resource fit, and validates the environment before deployment begins.',
    icon: ShieldCheck,
  },
  {
    number: '04',
    label: 'PROVISION',
    title: 'Environment Provisioning',
    media: '/media/step4.webp',
    description:
      'Dedicated infrastructure is securely configured, benchmarked, and prepared for your approved workload.',
    icon: KeyRound,
  },
  {
    number: '05',
    label: 'LAUNCH',
    title: 'Access Your Workspace',
    media: '/media/step5.webp',
    description:
      'Receive secure credentials and start working with JupyterLab, SSH, APIs, and the rest of your GPU workspace.',
    icon: CheckCircle,
  },
];

const readyStackTools = [
  { name: 'CUDA', version: '12.x', tag: 'Toolkit' },
  { name: 'PyTorch', version: '2.x', tag: 'Training' },
  { name: 'JupyterLab', version: 'Ready', tag: 'Workspace' },
  { name: 'SSH', version: 'Secure', tag: 'Access' },
  { name: 'vLLM', version: 'Optional', tag: 'Inference' },
  { name: 'Docker', version: 'Enabled', tag: 'Runtime' },
  { name: 'Drivers', version: 'Matched', tag: 'GPU' },
  { name: 'APIs', version: 'Available', tag: 'Integrations' },
  { name: 'Monitoring', version: 'Live', tag: 'Ops' },
];

const terminalLines = [
  { tone: 'command', text: '$ iternityverse launch --gpu H200 --region india' },
  { tone: 'spacer', text: '' },
  { tone: 'info', text: '[request] workload requirements received' },
  { tone: 'info', text: '[match]   suitable GPU capacity identified' },
  { tone: 'info', text: '[provision] compute environment initializing' },
  { tone: 'success', text: '[ready]   NVIDIA H200 allocated' },
  { tone: 'success', text: '[ready]   CUDA + drivers configured' },
  { tone: 'success', text: '[ready]   storage + networking attached' },
  { tone: 'spacer', text: '' },
  { tone: 'success', text: '[workspace] JupyterLab      ✓' },
  { tone: 'success', text: '[workspace] SSH Access      ✓' },
  { tone: 'success', text: '[workspace] API Endpoint    ✓' },
  { tone: 'success', text: '[workspace] Credentials     ✓' },
  { tone: 'spacer', text: '' },
  { tone: 'success', text: '[done] GPU workspace is ready' },
  { tone: 'spacer', text: '' },
  { tone: 'command', text: '$ iternityverse connect --workspace ai-training' },
  { tone: 'spacer', text: '' },
  { tone: 'info', text: 'GPU       NVIDIA H200' },
  { tone: 'info', text: 'VRAM      141 GB' },
  { tone: 'info', text: 'REGION    India' },
  { tone: 'success', text: 'STATUS    ● ONLINE' },
  { tone: 'spacer', text: '' },
  { tone: 'command', text: '> compute is ready.' },
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

function getTerminalLineClass(tone) {
  if (tone === 'command') return 'text-[#F5F7F6]';
  if (tone === 'success') return 'text-[#5EF0C8]';
  return 'text-[#8FA39B]';
}

function TerminalOutput({ reduceMotion }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const currentLine = terminalLines[lineIndex];
    const isSpacer = currentLine.tone === 'spacer';
    const isLineComplete = charIndex >= currentLine.text.length;
    const isFinalLine = lineIndex >= terminalLines.length - 1;

    const timeout = window.setTimeout(
      () => {
        if (isSpacer || isLineComplete) {
          if (isFinalLine) {
            setLineIndex(0);
            setCharIndex(0);
            return;
          }

          setLineIndex((current) => current + 1);
          setCharIndex(0);
          return;
        }

        setCharIndex((current) => current + 1);
      },
      isSpacer ? 90 : isLineComplete ? (isFinalLine ? 1500 : 180) : 18
    );

    return () => window.clearTimeout(timeout);
  }, [charIndex, lineIndex, reduceMotion]);

  const visibleLines = reduceMotion ? terminalLines : terminalLines.slice(0, lineIndex);
  const activeLine = reduceMotion ? null : terminalLines[lineIndex];

  return (
    <div className="flex h-full min-h-0 flex-col space-y-1 overflow-hidden font-mono text-xs leading-5 sm:text-[0.8rem] sm:leading-5">
      {visibleLines.map((line, index) =>
        line.tone === 'spacer' ? (
          <div key={`terminal-spacer-${index}`} className="h-1" aria-hidden="true" />
        ) : (
          <div key={`${line.text}-${index}`} className={getTerminalLineClass(line.tone)}>
            {line.text}
          </div>
        )
      )}

      {activeLine?.tone === 'spacer' ? (
        <div className="h-1" aria-hidden="true" />
      ) : (
        activeLine && (
          <div className={`whitespace-nowrap ${getTerminalLineClass(activeLine.tone)}`}>
            {activeLine.text.slice(0, charIndex)}
            <motion.span
              className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 bg-[#2DE8C4] shadow-[0_0_18px_rgba(45,232,196,0.7)]"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        )
      )}
    </div>
  );
}

function ReadyStackTool({ tool }) {
  return (
    <article className="ready-stack-tool">
      <span className="ready-stack-tool-signal" aria-hidden="true" />
      <div>
        <p className="ready-stack-tool-name">{tool.name}</p>
        <p className="ready-stack-tool-version">{tool.version}</p>
      </div>
      <p className="ready-stack-tool-tag">{tool.tag}</p>
    </article>
  );
}

function ReadyStackMarquee({ reduceMotion }) {
  return (
    <div
      className={`ready-stack-marquee ${reduceMotion ? 'is-static' : ''}`}
      aria-label="Pre-installed GPU workspace applications"
      tabIndex={0}
    >
      <div className="ready-stack-track">
        <div className="ready-stack-group">
          {readyStackTools.map((tool) => (
            <ReadyStackTool key={tool.name} tool={tool} />
          ))}
        </div>
        {!reduceMotion && (
          <div className="ready-stack-group" aria-hidden="true">
            {readyStackTools.map((tool) => (
              <ReadyStackTool key={`duplicate-${tool.name}`} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
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
        className="relative pt-10 pb-4 sm:pt-14 sm:pb-6 lg:pt-16 lg:pb-8"
        aria-labelledby="ready-stack-title"
      >
        <div className="pointer-events-none absolute inset-x-1/2 top-10 h-72 w-[90vw] -translate-x-1/2 rounded-full bg-[#2DE8C4]/[0.035] blur-3xl" />
        <motion.header
          className="relative z-10 max-w-4xl text-left"
          {...createFadeInMotion(reduceMotion, 'left', 0)}
        >
          <p className="text-xs font-bold tracking-[0.5em] text-[#2DE8C4]">ZERO SETUP</p>
          <h2
            id="ready-stack-title"
            className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#F5F7F6] sm:text-4xl lg:text-6xl"
          >
            SSH in. CUDA, drivers, and AI frameworks are already staged.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#8FA39B] sm:text-base">
            Your approved GPU workspace is prepared with the practical tools teams usually lose
            hours wiring together. One reviewed handoff, then you start building.
          </p>
        </motion.header>

        <div className="relative z-10 mt-10 space-y-6">
          <motion.div {...createFadeInMotion(reduceMotion, 'left', 0.08)}>
            <div className="cursor-spotlight-card group w-full rounded-[30px] transition duration-500">
              <div className="relative z-10 flex h-[460px] w-full flex-col rounded-[26px] bg-[radial-gradient(circle_at_18%_0%,rgba(45,232,196,0.1),transparent_32%),radial-gradient(circle_at_88%_100%,rgba(116,247,255,0.045),transparent_34%),linear-gradient(180deg,rgba(8,20,17,0.68),rgba(1,6,5,0.92))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.32)] sm:h-[500px] sm:p-7 lg:p-8">
                <div className="flex items-center justify-between gap-4 border-b border-[#2DE8C4]/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#FF6B6B]" />
                    <span className="h-3 w-3 rounded-full bg-[#F6C85F]" />
                    <span className="h-3 w-3 rounded-full bg-[#2DE8C4]" />
                  </div>
                  <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.34em] text-[#8FA39B]">
                    <Terminal className="h-3.5 w-3.5 text-[#2DE8C4]" />
                    Secure Shell
                  </div>
                </div>

                <div className="mt-6 flex min-h-0 flex-1">
                  <TerminalOutput reduceMotion={reduceMotion} />
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-x-7 gap-y-3 pt-8 text-xs text-[#8FA39B]">
                  {[
                    ['GPU', 'Reviewed fit'],
                    ['Access', 'Dashboard handoff'],
                    ['Stack', 'Pre-configured'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2DE8C4] shadow-[0_0_14px_rgba(45,232,196,0.8)]" />
                      <span className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-[#2DE8C4]">
                        {label}
                      </span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div {...createFadeInMotion(reduceMotion, 'right', 0.14)}>
            <div className="relative z-10 my-2 px-0 py-6 sm:my-3 sm:py-8 lg:my-4 lg:py-10">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.36em] text-[#2DE8C4]">
                    <PackageCheck className="h-4 w-4" />
                    Pre-installed
                  </p>
                  <h3 className="mt-4 max-w-xl text-2xl font-semibold tracking-tight text-[#F5F7F6] sm:text-3xl">
                    A launch-ready software shelf for serious GPU workloads.
                  </h3>
                </div>
                <span className="rounded-full border border-[#2DE8C4]/18 bg-[#2DE8C4]/[0.06] px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-[#A8FFF0]">
                  Updated weekly
                </span>
              </div>

              <ReadyStackMarquee reduceMotion={reduceMotion} />

              <div className="mt-5 flex flex-col gap-4 border-t border-[#2DE8C4]/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-xs leading-6 text-[#7E928B]">
                  Final packages depend on selected GPU, operating system, storage, and approved
                  workload requirements.
                </p>
                <Button
                  asChild
                  className="border-0 bg-[linear-gradient(135deg,#2DE8C4_0%,#18C8A2_100%)] font-bold text-[#03100D] shadow-[0_14px_38px_rgba(45,232,196,0.2)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(45,232,196,0.32)]"
                >
                  <Link to="/gpus">
                    Explore GPU packages
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        className="relative pt-0 pb-4 sm:pb-6 lg:pb-8"
        aria-labelledby="features-title how-it-works-title"
      >
          <section
            id="features"
            aria-labelledby="features-title"
            aria-describedby="features-description"
            className="relative z-10 py-4 sm:py-6 lg:py-8"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            <motion.header
              className="max-w-4xl text-left"
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
                className="mt-4 max-w-3xl text-sm leading-7 text-[#8FA39B] sm:text-base"
              >
                Compare specs, review access paths, and keep credential delivery organized with a
                section that reads cleanly and feels open, modern, and easy to scan.
              </p>
            </motion.header>

            <div className="relative z-10 mt-12 grid gap-6 md:grid-cols-3 lg:gap-7">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const direction = index % 2 === 0 ? 'left' : 'right';

                return (
                  <Card
                    key={feature.title}
                    interactive
                    className="group flex min-h-[430px] flex-col items-center justify-start rounded-[28px] border-[#2DE8C4]/12 bg-[#07110f]/78 px-6 py-9 text-center shadow-[0_22px_70px_rgba(0,0,0,0.28)] transition duration-300 hover:border-[#2DE8C4]/50 sm:px-7 lg:min-h-[460px] lg:px-8 lg:py-10"
                    {...createFadeInMotion(reduceMotion, direction, index * 0.1)}
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                  >
                    <div className="relative z-10 flex h-full w-full flex-col items-center">
                      <meta itemProp="position" content={`${index + 1}`} />
                      <meta itemProp="name" content={feature.title} />
                      <meta itemProp="description" content={feature.description} />

                      <div className="relative flex h-24 w-24 items-center justify-center rounded-[38%] bg-[#2DE8C4]/8 text-[#2DE8C4] shadow-[0_0_42px_rgba(45,232,196,0.14)] transition duration-300 group-hover:scale-105 group-hover:bg-[#2DE8C4]/12 group-hover:shadow-[0_0_58px_rgba(45,232,196,0.24)]">
                        <div className="absolute inset-0 rounded-[38%] bg-[radial-gradient(circle_at_50%_40%,rgba(245,247,246,0.16),transparent_46%)]" />
                        <Icon className="relative h-9 w-9 drop-shadow-[0_0_18px_rgba(45,232,196,0.38)]" />
                      </div>

                      <span className="mt-8 inline-flex rounded-full border border-[#2DE8C4]/15 bg-white/[0.03] px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.34em] text-[#2DE8C4]">
                        {feature.label}
                      </span>

                      <h3 className="mt-5 text-xl font-semibold tracking-tight text-[#F5F7F6] lg:text-2xl">
                        {feature.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-[#A8B8B1]">
                        {feature.description}
                      </p>

                      <div className="mt-7 grid w-full gap-3 text-left">
                        {feature.highlights.map((highlight) => (
                          <div
                            key={highlight}
                            className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-black/[0.12] px-4 py-3 text-xs leading-5 text-[#94A59E] transition duration-300 group-hover:border-[#2DE8C4]/14 group-hover:bg-[#2DE8C4]/[0.035]"
                          >
                            <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2DE8C4] drop-shadow-[0_0_10px_rgba(45,232,196,0.35)]" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </Card>
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
              className="max-w-4xl text-left"
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
                className="mt-4 max-w-3xl text-sm leading-7 text-[#8FA39B] sm:text-base"
              >
                From discovery to deployment, the workflow stays structured so every step is easy
                to follow, but the layout stays open and airy.
              </p>
            </motion.header>

            <div className="relative mt-14 overflow-visible">
              <svg
                className="pointer-events-none absolute left-0 top-20 hidden h-[610px] w-full xl:block"
                viewBox="0 0 1200 620"
                fill="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M 250 178 L 475 178 L 700 178 C 810 178, 845 275, 790 356 L 655 356"
                  stroke="url(#timelineGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduceMotion ? false : { pathLength: 0, opacity: 0.6 }}
                  whileInView={reduceMotion ? {} : { pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.8, ease: 'easeInOut' }}
                  markerEnd="url(#flowArrow)"
                />
                <motion.path
                  d="M 455 356 L 350 356"
                  stroke="url(#timelineGradientReverse)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={reduceMotion ? false : { pathLength: 0, opacity: 0.6 }}
                  whileInView={reduceMotion ? {} : { pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.8, delay: 1.35, ease: 'easeInOut' }}
                  markerEnd="url(#flowArrowReverse)"
                />
                {!reduceMotion && (
                  <motion.circle
                    r="5"
                    fill="#2DE8C4"
                    filter="url(#flowGlow)"
                    initial={{ offsetDistance: '0%', opacity: 0 }}
                    whileInView={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 4.2, ease: 'easeInOut', delay: 0.35 }}
                    style={{
                      offsetPath:
                        "path('M 250 178 L 475 178 L 700 178 C 810 178, 845 275, 790 356 L 655 356 L 455 356 L 350 356')",
                    }}
                  />
                )}
                <defs>
                  <linearGradient id="timelineGradient" x1="0" y1="0" x2="1200" y2="0">
                    <stop offset="0%" stopColor="#2DE8C4" stopOpacity="0.08" />
                    <stop offset="45%" stopColor="#2DE8C4" stopOpacity="0.68" />
                    <stop offset="100%" stopColor="#0D3B3E" stopOpacity="0.45" />
                  </linearGradient>
                  <linearGradient id="timelineGradientReverse" x1="700" y1="0" x2="300" y2="0">
                    <stop offset="0%" stopColor="#2DE8C4" stopOpacity="0.68" />
                    <stop offset="100%" stopColor="#0D3B3E" stopOpacity="0.35" />
                  </linearGradient>
                  <marker
                    id="flowArrow"
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="5"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#2DE8C4" opacity="0.8" />
                  </marker>
                  <marker
                    id="flowArrowReverse"
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="5"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#2DE8C4" opacity="0.8" />
                  </marker>
                  <filter id="flowGlow" x="-20" y="-20" width="40" height="40">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>

              <ol
                className="relative z-10 grid gap-7 md:grid-cols-2 xl:grid-cols-6 xl:gap-8"
                itemProp="step"
              >
                {howItWorksSteps.map((step, index) => {
                  const Icon = step.icon;
                  const direction = index % 2 === 0 ? 'left' : 'right';
                  const stepLayoutClass = [
                    'xl:col-span-2 xl:row-start-1',
                    'xl:col-span-2 xl:row-start-1',
                    'xl:col-span-2 xl:row-start-1',
                    'xl:col-span-2 xl:col-start-2 xl:row-start-2',
                    'xl:col-span-2 xl:col-start-4 xl:row-start-2',
                  ][index];

                  return (
                    <li
                      key={step.number}
                      className={`relative ${stepLayoutClass}`}
                      itemProp="step"
                      itemScope
                      itemType="https://schema.org/HowToStep"
                    >
                      <motion.div {...createFadeInMotion(reduceMotion, direction, index * 0.08)}>
                        <div className="cursor-spotlight-card group relative isolate flex min-h-[500px] overflow-hidden rounded-[32px] border border-[#2DE8C4]/16 bg-[linear-gradient(180deg,rgba(10,25,22,0.92),rgba(3,9,8,0.96))] shadow-[0_28px_90px_rgba(0,0,0,0.36)] backdrop-blur-xl transition duration-500 ease-premium hover:-translate-y-2 hover:border-[#2DE8C4]/55 hover:shadow-[0_36px_110px_rgba(45,232,196,0.16)] md:min-h-[520px] xl:min-h-[520px]">
                          <meta itemProp="position" content={`${index + 1}`} />
                          <meta itemProp="name" content={step.title} />
                          <meta itemProp="description" content={step.description} />

                          <div className="absolute inset-x-0 top-0 z-10 h-[46%] overflow-hidden">
                            <img
                              src={step.media}
                              alt=""
                              className="h-full w-full object-cover opacity-82 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,232,196,0.18),transparent_58%)]" />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#07110f]/10 via-[#07110f]/45 to-[#07110f]" />
                            <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2DE8C4]/60 to-transparent" />
                          </div>

                          <div
                            aria-hidden="true"
                            className="absolute right-5 top-5 z-20 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs font-bold tracking-[0.35em] text-[#F5F7F6] shadow-[0_12px_30px_rgba(0,0,0,0.28)] backdrop-blur-md"
                          >
                            {step.number}
                          </div>

                          <div className="relative z-20 flex h-full w-full flex-col px-6 pb-7 pt-[58%] sm:px-7">
                            <div className="mb-5 flex items-center justify-between gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2DE8C4]/18 bg-[rgba(45,232,196,0.08)] text-[#2DE8C4] shadow-[0_0_28px_rgba(45,232,196,0.18)] transition duration-300 group-hover:scale-105 group-hover:bg-[rgba(45,232,196,0.13)]">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-[#2DE8C4]/45 to-transparent" />
                              <div className="h-2 w-2 rounded-full bg-[#2DE8C4] shadow-[0_0_18px_rgba(45,232,196,0.75)]" />
                            </div>

                            <div className="min-h-[126px]">
                              <h3 className="text-2xl font-semibold tracking-tight text-[#F5F7F6]">
                                {step.title}
                              </h3>
                              <p className="mt-4 text-sm leading-7 text-[#9FB1AA]">
                                {step.description}
                              </p>
                            </div>

                            <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.35em] text-[#A0AEC0]">
                                <span className="h-px w-8 bg-[#2DE8C4]/45" />
                                {step.label}
                              </div>
                              <div className="relative h-9 w-9 rounded-full border border-[#2DE8C4]/25 bg-[#2DE8C4]/5">
                                {!reduceMotion && (
                                  <motion.span
                                    className="absolute inset-1 rounded-full border border-[#2DE8C4]/45"
                                    animate={{ scale: [0.72, 1.12, 0.72], opacity: [0.3, 0.85, 0.3] }}
                                    transition={{
                                      duration: 2.4,
                                      repeat: Infinity,
                                      delay: index * 0.22,
                                      ease: 'easeInOut',
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="pointer-events-none absolute inset-0 z-[1] rounded-[32px] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_30%,rgba(45,232,196,0.06)_100%)] opacity-70" />
                          <div className="pointer-events-none absolute -bottom-20 left-1/2 z-0 h-44 w-44 -translate-x-1/2 rounded-full bg-[#2DE8C4]/10 blur-3xl transition duration-500 group-hover:bg-[#2DE8C4]/18" />
                        </div>
                      </motion.div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
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
                  <div
                    key={item.title}
                    className="cursor-spotlight-card group flex items-start gap-5 rounded-[24px] border border-[#2DE8C4]/10 bg-[#07110f]/42 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.16)] transition duration-300 hover:border-[#2DE8C4]/38 hover:bg-[#07110f]/66 hover:shadow-[0_24px_64px_rgba(45,232,196,0.09)]"
                  >
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
              <div className="cursor-spotlight-card relative overflow-hidden rounded-[30px] border border-[#2DE8C4]/12 bg-[rgba(13,27,30,0.4)] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-[16px] transition duration-300 hover:border-[#2DE8C4]/42 sm:p-8">
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

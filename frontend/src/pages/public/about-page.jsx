import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BrainCircuit,
  Compass,
  Eye,
  Gauge,
  Lightbulb,
  Orbit,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { PublicPageHero } from '@/components/common/public-page-hero.jsx';
import { Seo } from '@/components/common/seo.jsx';
import { Button } from '@/components/ui/index.js';
import { createBreadcrumbSchema } from '@/utils/seo-schema.js';

const frictionSignals = [
  { label: 'quota friction', detail: 'capacity is available, but hard to plan around' },
  { label: 'unclear specs', detail: 'teams compare numbers without workload context' },
  { label: 'setup drag', detail: 'environments steal time from model work' },
  { label: 'handoff risk', detail: 'credentials and next steps get scattered' },
];

const whyExist = [
  {
    title: 'Clarity over noise',
    text: 'GPU infrastructure should be understandable before a team commits time, budget, or trust.',
    icon: Eye,
  },
  {
    title: 'Momentum over waiting',
    text: 'The best infrastructure gets out of the way quickly, without making serious teams feel rushed.',
    icon: Zap,
  },
  {
    title: 'Useful over inflated',
    text: 'We prefer practical fit, transparent expectations, and dependable access over loud promises.',
    icon: Target,
  },
  {
    title: 'Calm over chaos',
    text: 'Every handoff should feel deliberate, secure, and easy to understand when the stakes are high.',
    icon: ShieldCheck,
  },
];

const builderGroups = [
  { label: 'AI teams', detail: 'Training, inference, evaluation loops', icon: BrainCircuit },
  { label: 'Researchers', detail: 'Experiments that need clear capacity', icon: Lightbulb },
  { label: 'Creative labs', detail: 'Rendering, media, and simulation workloads', icon: Sparkles },
  { label: 'Founders', detail: 'Fast validation without infrastructure sprawl', icon: Gauge },
];

const standards = [
  { title: 'Fast to understand', text: 'The first scan should answer the obvious questions.' },
  { title: 'Human to evaluate', text: 'Serious access deserves a thoughtful review path.' },
  { title: 'Secure to hand off', text: 'Credentials should never feel casual or scattered.' },
  { title: 'Calm to operate', text: 'The experience should feel composed after approval.' },
];

function createRevealMotion(reduceMotion, delay = 0) {
  if (reduceMotion) {
    return {
      initial: false,
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.24 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.24 },
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  };
}

export function AboutPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-24 pb-16">
      <Seo
        title="About iTernityverse"
        description="Learn why iTernityverse is building clearer, calmer GPU infrastructure access for serious AI, research, rendering, and inference teams."
        path="/about"
        structuredData={[
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />

      <PublicPageHero
        eyebrow="About Us"
        title="GPU infrastructure should feel like momentum, not procurement."
        description="iTernityverse exists for builders who need powerful GPU workspaces with less confusion, fewer handoff gaps, and a calmer path from intent to compute."
        variant="about"
      />

      <section className="relative overflow-hidden rounded-[36px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(45,232,196,0.11),transparent_32%),radial-gradient(circle_at_84%_66%,rgba(45,232,196,0.06),transparent_30%)]" />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <motion.div {...createRevealMotion(reduceMotion, 0)}>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-[#2DE8C4]">
              Origin
            </p>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-[#F5F7F6] sm:text-4xl lg:text-6xl">
              We started with a simple belief: access should not slow down ambition.
            </h2>
          </motion.div>

          <motion.div
            className="cursor-spotlight-card rounded-[30px] border border-[#2DE8C4]/12 bg-[#07110f]/58 p-6 shadow-[0_26px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8"
            {...createRevealMotion(reduceMotion, 0.08)}
          >
            <div className="relative z-10 space-y-5">
              <p className="text-base leading-8 text-[#A8B8B1]">
                A lot of GPU access still feels like guesswork: specs without context, pricing
                without confidence, and setup work that arrives exactly when teams want to move.
              </p>
              <p className="text-base leading-8 text-[#A8B8B1]">
                We are shaping iTernityverse as the opposite experience: clear enough to compare,
                careful enough to trust, and focused enough to keep builders moving.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-4" aria-labelledby="problem-title">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center">
          <motion.div {...createRevealMotion(reduceMotion, 0)}>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-[#2DE8C4]">
              The problem we saw
            </p>
            <h2
              id="problem-title"
              className="mt-5 text-3xl font-semibold tracking-tight text-[#F5F7F6] sm:text-4xl lg:text-5xl"
            >
              Compute decisions are often harder than the work they are meant to unlock.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#8FA39B] sm:text-base">
              Serious teams do not just need a GPU. They need confidence that the package,
              environment, region, and access path will not become a new bottleneck.
            </p>
          </motion.div>

          <motion.div
            className="cursor-spotlight-card relative min-h-[430px] overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,rgba(45,232,196,0.11),rgba(6,16,14,0.74)_38%,rgba(1,7,6,0.94))] p-6 shadow-[0_34px_100px_rgba(0,0,0,0.32)] sm:p-8"
            {...createRevealMotion(reduceMotion, 0.08)}
          >
            <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(45,232,196,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(45,232,196,0.16)_1px,transparent_1px)] [background-size:48px_48px]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
            {!reduceMotion && (
              <motion.div
                className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-transparent via-[#2DE8C4]/18 to-transparent blur-sm"
                animate={{ x: ['-30%', '940%'] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}

            <div className="relative z-10 flex items-center justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#2DE8C4]">
                  Friction scan
                </p>
                <h3 className="mt-4 max-w-xl text-2xl font-semibold text-[#F5F7F6] sm:text-3xl">
                  The real problem is not just access. It is uncertainty before access.
                </h3>
              </div>
              <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-[30%] border border-[#2DE8C4]/18 bg-[#2DE8C4]/[0.07] text-[#2DE8C4] shadow-[0_0_42px_rgba(45,232,196,0.18)] sm:flex">
                <Compass className="h-7 w-7" />
              </div>
            </div>

            <div className="relative z-10 mt-8 space-y-3">
              {frictionSignals.map((signal, index) => (
                <motion.div
                  key={signal.label}
                  className="group grid gap-3 rounded-[24px] border border-white/[0.07] bg-[#06100E]/64 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_44px_rgba(0,0,0,0.2)] backdrop-blur-xl transition duration-300 hover:border-[#2DE8C4]/24 sm:grid-cols-[10rem_1fr]"
                  {...createRevealMotion(reduceMotion, index * 0.05)}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2DE8C4]/[0.08] text-[0.65rem] font-bold text-[#2DE8C4]">
                      0{index + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#F5F7F6]">
                      {signal.label}
                    </span>
                  </div>
                  <div className="relative overflow-hidden rounded-full bg-white/[0.035] px-4 py-2 text-xs leading-5 text-[#8FA39B]">
                    {!reduceMotion && (
                      <motion.span
                        className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-transparent via-[#2DE8C4]/20 to-transparent"
                        animate={{ x: ['-120%', '720%'] }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          delay: index * 0.18,
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                    <span className="relative z-10">{signal.detail}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section aria-labelledby="why-exist-title">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start">
          <motion.div className="lg:sticky lg:top-28" {...createRevealMotion(reduceMotion, 0)}>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-[#2DE8C4]">
              Why we exist
            </p>
            <h2
              id="why-exist-title"
              className="mt-5 text-3xl font-semibold tracking-tight text-[#F5F7F6] sm:text-4xl lg:text-5xl"
            >
              Not another cloud catalog. A calmer way to make compute decisions.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#8FA39B] sm:text-base">
              The product is shaped around the moments where infrastructure usually becomes
              stressful: comparison, commitment, setup, and handoff.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-6">
            {whyExist.map((item, index) => {
              const Icon = item.icon;
              const layoutClass = index === 0 || index === 3 ? 'md:col-span-4' : 'md:col-span-2';

              return (
                <motion.article
                  key={item.title}
                  className={`cursor-spotlight-card group relative min-h-[240px] overflow-hidden rounded-[32px] border border-[#2DE8C4]/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.075),rgba(45,232,196,0.035),rgba(2,10,8,0.44))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.11),0_24px_74px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#2DE8C4]/34 ${layoutClass}`}
                  {...createRevealMotion(reduceMotion, index * 0.06)}
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#2DE8C4]/10 blur-3xl transition duration-300 group-hover:bg-[#2DE8C4]/16" />
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2DE8C4]/18 bg-[#2DE8C4]/[0.07] text-[#2DE8C4] shadow-[0_0_30px_rgba(45,232,196,0.14)]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-white/[0.035] px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-[#8FA39B]">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-auto pt-10 text-xl font-semibold text-[#F5F7F6]">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[#8FA39B]">{item.text}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[36px] bg-[#06100E]/70 px-5 py-12 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:px-8 lg:px-10 lg:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,232,196,0.11),transparent_40%)]" />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center">
          <motion.div {...createRevealMotion(reduceMotion, 0)}>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-[#2DE8C4]">
              Built for serious builders
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#F5F7F6] sm:text-4xl lg:text-5xl">
              Different teams, same need: clear compute that does not fight the work.
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {builderGroups.map((group, index) => {
              const Icon = group.icon;

              return (
                <motion.div
                  key={group.label}
                  className="cursor-spotlight-card rounded-[26px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(45,232,196,0.035),rgba(2,10,8,0.34))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl"
                  {...createRevealMotion(reduceMotion, index * 0.06)}
                >
                  <div className="relative z-10 flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2DE8C4]/[0.08] text-[#2DE8C4]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#F5F7F6]">{group.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#8FA39B]">{group.detail}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-8" aria-labelledby="standard-title">
        <motion.div className="max-w-4xl" {...createRevealMotion(reduceMotion, 0)}>
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-[#2DE8C4]">
            The iTernityverse standard
          </p>
          <h2
            id="standard-title"
            className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-[#F5F7F6] sm:text-4xl lg:text-6xl"
          >
            We are not making GPU infrastructure louder. We are making it easier to trust.
          </h2>
        </motion.div>

        <div className="relative mt-14 grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
          <motion.div
            className="cursor-spotlight-card relative min-h-[420px] overflow-hidden rounded-[36px] bg-[radial-gradient(circle_at_50%_48%,rgba(45,232,196,0.16),rgba(7,17,15,0.65)_34%,rgba(1,7,6,0.94)_72%)] p-8 shadow-[0_34px_100px_rgba(0,0,0,0.3)]"
            {...createRevealMotion(reduceMotion, 0.08)}
          >
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2DE8C4]/16" />
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#2DE8C4]/12" />
            {!reduceMotion && (
              <motion.div
                className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border-l border-t border-[#2DE8C4]/35"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[34%] border border-[#2DE8C4]/18 bg-[#06100E]/78 text-[#2DE8C4] shadow-[0_0_54px_rgba(45,232,196,0.18)] backdrop-blur-xl">
              <Orbit className="h-10 w-10" />
            </div>
            <p className="absolute bottom-8 left-8 right-8 text-center text-sm leading-7 text-[#8FA39B]">
              A standard for infrastructure that feels measured, precise, and intentionally calm.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {standards.map((standard, index) => (
              <motion.div
                key={standard.title}
                className="cursor-spotlight-card rounded-[28px] border border-[#2DE8C4]/12 bg-[#07110f]/68 p-5 shadow-[0_22px_68px_rgba(0,0,0,0.24)] backdrop-blur-xl"
                {...createRevealMotion(reduceMotion, index * 0.06)}
              >
                <div className="relative z-10">
                  <span className="text-xs font-bold tracking-[0.35em] text-[#2DE8C4]">
                    0{index + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-[#F5F7F6]">
                    {standard.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#8FA39B]">{standard.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-32 max-w-6xl px-2 pb-10 pt-4">
        <div className="cursor-spotlight-card relative overflow-hidden rounded-[42px] bg-[linear-gradient(135deg,rgba(45,232,196,0.1),rgba(7,17,15,0.82)_42%,rgba(1,7,6,0.94))] px-6 py-16 text-center shadow-[0_38px_120px_rgba(0,0,0,0.34)] sm:px-10 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,232,196,0.16),transparent_48%)]" />
          <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2DE8C4]/18 bg-[#2DE8C4]/[0.08] text-[#2DE8C4] shadow-[0_0_36px_rgba(45,232,196,0.18)]">
              <Orbit className="h-6 w-6" />
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.5em] text-[#2DE8C4]">
              Start building
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#F5F7F6] sm:text-4xl lg:text-5xl">
              Find the GPU workspace that keeps your project moving.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#8FA39B] sm:text-base">
              Explore available packages or reach out if your workload needs a more careful
              capacity conversation.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                className="border-0 bg-[linear-gradient(135deg,#2DE8C4_0%,#18C8A2_100%)] font-bold text-[#03100D] shadow-[0_14px_38px_rgba(45,232,196,0.2)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(45,232,196,0.32)]"
              >
                <Link to="/gpus">
                  Explore GPUs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#2DE8C4]/18 bg-[#06100E]/70 text-[#F5F7F6] hover:border-[#2DE8C4]/38 hover:bg-[#2DE8C4]/[0.07]"
              >
                <Link to="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

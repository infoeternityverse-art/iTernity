import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle, Cpu, KeyRound, MessageSquare, ShieldCheck } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, SectionHeader } from '@/components/ui/index.js';
import { HeroGpuVisual } from '@/components/hero/hero-gpu-visual.jsx';
import { GpuComputeStory } from '@/components/home/gpu-compute-story.jsx';
import { Seo } from '@/components/common/seo.jsx';
import { createOrganizationSchema, createWebsiteSchema } from '@/utils/seo-schema.js';

const features = [
  {
    title: 'Curated GPU Rentals',
    description: 'Compare practical GPU packages by VRAM, CPU, RAM, storage, price, and region.',
    icon: Cpu,
  },
  {
    title: 'Human Reviewed Access',
    description: 'Submit your project requirements and receive the right setup after admin review.',
    icon: ShieldCheck,
  },
  {
    title: 'Credentials In Dashboard',
    description: 'Approved customers can later access issued credentials from their account area.',
    icon: KeyRound,
  },
];

const steps = [
  'Browse GPU packages',
  'Submit an enquiry',
  'Team reviews the request',
  'Receive access credentials',
];

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

      <section className="space-y-6">
        <SectionHeader
          title="Features"
          description="A marketplace foundation designed for practical GPU rental workflows."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title}>
                <CardHeader
                  title={feature.title}
                  action={<Icon className="h-5 w-5 text-brand-600" />}
                />
                <CardContent>
                  <p className="text-sm text-[#8FA39B]">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader title="How It Works" description="A simple enquiry-first rental journey." />
        <div className="grid gap-3 md:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={step}>
              <CardContent className="p-5">
                <p className="mb-3 text-sm font-semibold text-brand-600">Step {index + 1}</p>
                <p className="font-medium">{step}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <SectionHeader title="Why Choose Us" description="Built for careful workload matching." />
          {[
            'Transparent package specs',
            'Manual review for fit',
            'Credential handoff workflow',
          ].map((item) => (
            <p key={item} className="flex items-center gap-2 text-[#F5F7F6]">
              <CheckCircle className="h-5 w-5 text-brand-500" />
              {item}
            </p>
          ))}
        </div>
        <Card>
          <CardContent className="space-y-4 p-6">
            <MessageSquare className="h-8 w-8 text-brand-600" />
            <h2 className="text-2xl font-semibold">Ready to discuss your workload?</h2>
            <p className="text-[#8FA39B]">
              Start with the marketplace and submit an enquiry from the package that best matches
              your requirements.
            </p>
            <Button asChild>
              <Link to="/gpus">Find a GPU package</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

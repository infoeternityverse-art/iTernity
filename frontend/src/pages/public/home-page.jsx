import { Link } from 'react-router-dom';
import { CheckCircle, Cpu, KeyRound, MessageSquare, ShieldCheck } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, SectionHeader } from '@/components/ui/index.js';
import { HeroGpuVisual } from '@/components/hero/hero-gpu-visual.jsx';

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

export function HomePage() {
  return (
    <div className="space-y-16">
      <section className="hero-panel relative left-1/2 -ml-[50vw] -mt-12 flex min-h-screen w-screen max-w-[100vw] items-center overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32">
        <div className="hero-panel-grid pointer-events-none absolute inset-0" />
        <div className="hero-panel-dust pointer-events-none absolute inset-0" />

        <div className="hero-content-grid mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.45fr_0.55fr]">
          <div className="hero-copy relative z-10 max-w-xl text-center lg:text-left">
            <div className="space-y-6">
              <h1 className="hero-heading">
                Production<br />
                GPU capacity,<br />
                Built for<br />
                  Modern AI.
              </h1>
              <p className="hero-subheadline mx-auto lg:mx-0">
                Accelerate AI Innovation with Enterprise GPU Cloud.
              </p>
            </div>
          </div>

          <div className="hero-visual-column relative z-10 min-h-[360px] min-w-0 overflow-hidden sm:min-h-[500px]">
            <HeroGpuVisual />
          </div>
        </div>
      </section>

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
                  <p className="text-sm text-[#A6B0CF]">{feature.description}</p>
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
            <p key={item} className="flex items-center gap-2 text-[#DDE4FF]">
              <CheckCircle className="h-5 w-5 text-brand-500" />
              {item}
            </p>
          ))}
        </div>
        <Card>
          <CardContent className="space-y-4 p-6">
            <MessageSquare className="h-8 w-8 text-brand-600" />
            <h2 className="text-2xl font-semibold">Ready to discuss your workload?</h2>
            <p className="text-[#A6B0CF]">
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

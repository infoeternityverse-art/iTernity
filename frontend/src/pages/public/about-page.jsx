import { Check, Clock, Cpu, Network, ShieldCheck, Sparkles, Users, X, Zap } from 'lucide-react';
import { PublicPageHero } from '@/components/common/public-page-hero.jsx';
import { Seo } from '@/components/common/seo.jsx';
import { Card, CardContent } from '@/components/ui/index.js';
import { createBreadcrumbSchema } from '@/utils/seo-schema.js';

const trustMarks = ['AI labs', 'Render teams', 'Research groups', 'Inference teams'];

const stats = [
  {
    label: '150+',
    title: 'Workloads reviewed',
    description: 'Manual matching for teams that need practical GPU capacity.',
    icon: Users,
  },
  {
    label: '1M+',
    title: 'GPU hours planned',
    description: 'Capacity conversations shaped around real project constraints.',
    icon: Clock,
  },
  {
    label: '95%',
    title: 'Less guesswork',
    description: 'Clear package specs before customers request access.',
    icon: Zap,
  },
];

const values = [
  {
    title: 'Driving Infrastructure Clarity',
    description: 'We make GPU package decisions easier with direct specs and simple workflows.',
    icon: Cpu,
  },
  {
    title: 'Committed to Trust',
    description: 'Manual review keeps customer access controlled, intentional, and accountable.',
    icon: ShieldCheck,
  },
  {
    title: 'Built for Growth',
    description: 'The MVP foundation is ready for future provisioning and monitoring layers.',
    icon: Network,
  },
  {
    title: 'Customers First',
    description: 'Every workflow is designed around reducing friction from enquiry to access.',
    icon: Sparkles,
  },
];

const manualWork = [
  'Unclear package comparison',
  'Slow credential handoff',
  'Limited request visibility',
  'Hard-to-track admin notes',
];

const platformWork = [
  'Structured GPU catalogue',
  'Admin enquiry pipeline',
  'Customer-visible status history',
  'Credential access workflow',
];

export function AboutPage() {
  return (
    <div className="space-y-24 pb-8">
      <Seo
        title="About iTernityverse"
        description="Learn how iTernityverse helps AI, rendering, research, and inference teams compare GPU packages and request reviewed cloud GPU access."
        path="/about"
        structuredData={[
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />
      <section className="mx-auto max-w-5xl space-y-8 text-center">
        <PublicPageHero
          eyebrow="About Us"
          title="Helping teams access GPU capacity with confidence"
          description="We help AI, rendering, research, and inference teams move from uncertain capacity shopping to a clear, reviewed GPU rental workflow."
          variant="about"
        />
        <div className="space-y-5 pt-12">
          <p className="text-sm font-bold text-white">Trusted by practical compute teams</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustMarks.map((mark) => (
              <div
                key={mark}
                className="cosmic-hover-card rounded-card border border-[rgba(45,232,196,0.15)] bg-[#0E1310]/88 px-5 py-4 text-sm font-bold text-[#CFE7DF] shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur"
              >
                {mark}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-5 text-center">
        <p className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white">
          Who We Are
        </p>
        <h2 className="text-4xl font-black tracking-normal text-white md:text-5xl">Who We Are</h2>
        <p className="mx-auto max-w-3xl text-base leading-7 text-[#8FA39B]">
          This marketplace is built for teams that need more than a raw listing. Customers browse
          package details, submit workload requirements, and receive access after administrator
          review.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-brand-500" />
                  <p className="text-2xl font-black text-white">{stat.label}</p>
                </div>
                <div>
                  <h3 className="font-bold text-white">{stat.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#8FA39B]">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-4 text-center">
          <p className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white">
            Our Values
          </p>
          <h2 className="text-4xl font-black tracking-normal text-white">
            The values behind the platform
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-[#8FA39B]">
            We are building the foundation carefully now so provisioning, monitoring, and billing
            can be added later without disturbing the customer journey.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <Card key={value.title}>
                <CardContent className="flex gap-4 p-5">
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-brand-500" />
                  <div>
                    <h3 className="font-bold text-white">{value.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#8FA39B]">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4 text-center">
          <p className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white">
            Why Us
          </p>
          <h2 className="text-4xl font-black tracking-normal text-white">
            What makes us stand out in the industry
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-[#8FA39B]">
            The MVP is intentionally focused: clear packages, reviewed enquiries, and controlled
            credential delivery.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              <h3 className="font-bold text-white">Manual Work</h3>
              <div className="space-y-3">
                {manualWork.map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm text-[#8FA39B]">
                    <X className="h-4 w-4 text-red-400" />
                    {item}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4 p-6">
              <h3 className="font-bold text-white">GPU Cloud Marketplace</h3>
              <div className="space-y-3">
                {platformWork.map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm text-[#F5F7F6]">
                    <Check className="h-4 w-4 text-brand-500" />
                    {item}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

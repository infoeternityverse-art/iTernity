import { zodResolver } from '@hookform/resolvers/zod';
import {
  Clock,
  Globe2,
  Headphones,
  Mail,
  MessageSquare,
  Network,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { env } from '@/config/env.js';
import { Alert, Button, Input, Textarea } from '@/components/ui/index.js';
import { PublicPageHero } from '@/components/common/public-page-hero.jsx';
import { Seo } from '@/components/common/seo.jsx';
import { useCreateContactEnquiry } from '@/hooks/index.js';
import { createBreadcrumbSchema } from '@/utils/seo-schema.js';

const contactSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters.').max(60),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters.').max(60),
  email: z.string().trim().email('Enter a valid email address.').max(254),
  phone: z.string().trim().max(40, 'Phone number is too long.').optional(),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters.').max(120),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.').max(5000),
});

const contactTopics = [
  'GPU pricing',
  'Enterprise access',
  'Billing / INR',
  'Technical issue',
  'Partnership',
];

const contactAssurances = [
  {
    title: 'Human reviewed',
    text: 'Every message is routed to the team before follow-up.',
    icon: ShieldCheck,
  },
  {
    title: 'Workspace guidance',
    text: 'We help match GPU, region, storage, and access needs.',
    icon: Network,
  },
  {
    title: 'Operational support',
    text: 'Credential, dashboard, and provisioning questions stay in one flow.',
    icon: Headphones,
  },
];

const supportSignals = [
  { label: 'Response flow', value: 'Manual team review', icon: Clock },
  { label: 'Coverage', value: 'Remote GPU support', icon: Globe2 },
  { label: 'Use cases', value: 'AI, rendering, research', icon: Zap },
];

export function ContactPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const createContactEnquiry = useCreateContactEnquiry({
    onSuccess: () => navigate('/contact-thank-you'),
  });

  const onSubmit = (values) =>
    createContactEnquiry.mutate({
      contactName: `${values.firstName} ${values.lastName}`,
      contactEmail: values.email,
      contactPhone: values.phone,
      subject: values.subject,
      message: values.message,
    });

  return (
    <>
      <Seo
        title="Contact iTernityverse"
        description="Contact iTernityverse for general enquiries, support questions, partnerships, account help, and platform requests."
        path="/contact"
        structuredData={[
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact iTernityverse',
            url: `${env.siteUrl}/contact`,
            email: env.supportEmail,
          },
        ]}
      />

      <PublicPageHero
        eyebrow="Contact"
        title="Get in touch with us"
        description="Send a general enquiry to the iTernityverse team. Your message goes directly to the admin queue for review and follow-up."
        variant="contact"
      />

      <div className="relative mx-auto max-w-7xl pb-10">
      <section className="relative z-10 pt-10 sm:pt-12" aria-labelledby="contact-title">
        <p className="text-xs font-bold uppercase tracking-[0.52em] text-[#2DE8C4]">Contact us</p>
        <h1
          id="contact-title"
          className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-[#F5F7F6] sm:text-4xl lg:text-5xl"
        >
          Let&apos;s build your GPU workspace with fewer unknowns.
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#93A69F] sm:text-base">
          Infrastructure questions, enterprise pricing, account help, or technical setup details.
          Send the context once and our team will route it into the right review flow.
        </p>
      </section>

      <div className="relative z-10 mt-10 grid gap-7 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="cursor-spotlight-card overflow-hidden rounded-[32px] border border-[#2DE8C4]/14 bg-[#07110f]/86 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl transition duration-500 hover:border-[#2DE8C4]/42 sm:p-7">
          <div className="relative z-10">
            <div className="border-b border-[#2DE8C4]/10 pb-6">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.36em] text-[#2DE8C4]">
                <MessageSquare className="h-4 w-4" />
                Send a message
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-[#F5F7F6]">Get in touch</h2>
              <p className="mt-2 text-sm leading-6 text-[#8FA39B]">
                We respond to all enquiries after review, so the reply is useful instead of generic.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {contactTopics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-[#2DE8C4]/14 bg-[#2DE8C4]/[0.045] px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#A8FFF0]"
                >
                  {topic}
                </span>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
              {createContactEnquiry.error && (
                <Alert variant="danger">
                  {createContactEnquiry.error.message || 'Unable to submit your enquiry.'}
                </Alert>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  id="firstName"
                  label="First Name"
                  placeholder="Jane"
                  disabled={createContactEnquiry.isPending}
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <Input
                  id="lastName"
                  label="Last Name"
                  placeholder="Smith"
                  disabled={createContactEnquiry.isPending}
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="jane@example.com"
                  disabled={createContactEnquiry.isPending}
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  id="phone"
                  label="Phone"
                  placeholder="+1 (969) 819-8061"
                  disabled={createContactEnquiry.isPending}
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </div>

              <Input
                id="subject"
                label="Subject"
                placeholder="Support, partnership, billing, account help..."
                disabled={createContactEnquiry.isPending}
                error={errors.subject?.message}
                {...register('subject')}
              />

              <Textarea
                id="message"
                label="Message"
                placeholder="Tell us what you need help with..."
                disabled={createContactEnquiry.isPending}
                error={errors.message?.message}
                {...register('message')}
              />

              <Button type="submit" className="w-full" loading={createContactEnquiry.isPending}>
                Send message
              </Button>
            </form>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="cursor-spotlight-card rounded-[28px] border border-[#2DE8C4]/14 bg-[#07110f]/82 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl transition duration-500 hover:border-[#2DE8C4]/42">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#2DE8C4]">
                Direct support
              </p>
              <div className="mt-5 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#2DE8C4]/18 bg-[#2DE8C4]/[0.07] text-[#2DE8C4]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F5F7F6]">Email</p>
                  <a
                    href={`mailto:${env.supportEmail}`}
                    className="mt-1 block break-all text-sm text-[#8FA39B] transition hover:text-[#2DE8C4]"
                  >
                    {env.supportEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="cursor-spotlight-card rounded-[28px] border border-[#2DE8C4]/12 bg-[#07110f]/78 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-500 hover:border-[#2DE8C4]/38">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#2DE8C4]">
                Why teams write
              </p>
              <div className="mt-5 space-y-4">
                {contactAssurances.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#2DE8C4]/16 bg-[#2DE8C4]/[0.055] text-[#2DE8C4]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#F5F7F6]">{item.title}</h3>
                        <p className="mt-1 text-xs leading-5 text-[#8FA39B]">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {supportSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div
                  key={signal.label}
                  className="cursor-spotlight-card rounded-[22px] border border-[#2DE8C4]/10 bg-[#06100E]/70 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-300 hover:border-[#2DE8C4]/34"
                >
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#2DE8C4]/[0.07] text-[#2DE8C4]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-[#789089]">
                        {signal.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#F5F7F6]">{signal.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { env } from '@/config/env.js';
import { Alert, Button, Card, CardContent, Input, Textarea } from '@/components/ui/index.js';
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
    <div className="mx-auto max-w-4xl space-y-8 pb-8">
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 p-6">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-white" />
              <h2 className="font-bold text-white">E-mail</h2>
            </div>
            <a
              href={`mailto:${env.supportEmail}`}
              className="text-sm text-[#8FA39B] hover:text-white"
            >
              {env.supportEmail}
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-6">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-white" />
              <h2 className="font-bold text-white">Response flow</h2>
            </div>
            <p className="text-sm text-[#8FA39B]">Manual response after team review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              Submit Enquiry
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { env } from '@/config/env.js';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Textarea,
} from '@/components/ui/index.js';
import { PublicPageHero } from '@/components/common/public-page-hero.jsx';
import { useCreateEnquiry, useGpuPackages } from '@/hooks/index.js';

const contactSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters.').max(60),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters.').max(60),
  email: z.string().trim().email('Enter a valid email address.').max(254),
  phone: z.string().trim().max(40, 'Phone number is too long.').optional(),
  gpuPackage: z.string().trim().min(1, 'Choose a preferred GPU package.'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.').max(5000),
});

export function ContactPage() {
  const navigate = useNavigate();
  const { data: gpuPackagesResponse, isLoading: packagesLoading } = useGpuPackages({ limit: 50 });
  const packageOptions = useMemo(
    () =>
      (gpuPackagesResponse?.data || []).map((gpuPackage) => ({
        value: gpuPackage.id || gpuPackage._id,
        label: gpuPackage.name,
      })),
    [gpuPackagesResponse?.data]
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gpuPackage: '',
      message: '',
    },
  });

  const createEnquiry = useCreateEnquiry({
    onSuccess: () => navigate('/thank-you'),
  });

  useEffect(() => {
    if (packageOptions.length) {
      setValue('gpuPackage', packageOptions[0].value);
    }
  }, [packageOptions, setValue]);

  const onSubmit = (values) =>
    createEnquiry.mutate({
      gpuPackage: values.gpuPackage,
      contactName: `${values.firstName} ${values.lastName}`,
      contactEmail: values.email,
      contactPhone: values.phone,
      projectDescription: values.message,
      expectedUsage: 'Contact page enquiry',
      duration: 'To be discussed',
      budget: null,
    });

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <PublicPageHero
        eyebrow="Contact"
        title="Get in touch with us"
        description="Tell us about your workload and preferred GPU package. The request is sent directly to the admin enquiry queue for review."
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
              <h2 className="font-bold text-white">Review flow</h2>
            </div>
            <p className="text-sm text-[#8FA39B]">Manual response after admin review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {createEnquiry.error && (
              <Alert variant="danger">
                {createEnquiry.error.message || 'Unable to submit your enquiry.'}
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="firstName"
                label="First Name"
                placeholder="Jane"
                disabled={createEnquiry.isPending}
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                id="lastName"
                label="Last Name"
                placeholder="Smith"
                disabled={createEnquiry.isPending}
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
                disabled={createEnquiry.isPending}
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                id="phone"
                label="Phone"
                placeholder="+1 (969) 819-8061"
                disabled={createEnquiry.isPending}
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>

            <Select
              id="gpuPackage"
              label="Preferred GPU Package"
              placeholder={packagesLoading ? 'Loading packages...' : 'Choose a GPU package'}
              options={packageOptions}
              disabled={createEnquiry.isPending || packagesLoading || packageOptions.length === 0}
              loading={packagesLoading}
              error={errors.gpuPackage?.message}
              helperText={
                packageOptions.length === 0 && !packagesLoading
                  ? 'Create or publish at least one GPU package before using the contact form.'
                  : undefined
              }
              {...register('gpuPackage')}
            />

            <Textarea
              id="message"
              label="Message"
              placeholder="Hi, I need GPU capacity for..."
              disabled={createEnquiry.isPending}
              error={errors.message?.message}
              {...register('message')}
            />

            <Button
              type="submit"
              className="w-full"
              loading={createEnquiry.isPending}
              disabled={packagesLoading || packageOptions.length === 0}
            >
              Submit Form
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

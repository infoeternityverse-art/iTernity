import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, Button, Input, Textarea } from '@/components/ui/index.js';

const enquiryFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(120),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().max(40, 'Phone number is too long.').optional(),
  projectDescription: z
    .string()
    .trim()
    .min(10, 'Project description must be at least 10 characters.')
    .max(5000),
  expectedUsage: z.string().trim().max(2000).optional(),
  duration: z.string().trim().max(120).optional(),
});

export function EnquiryForm({
  gpuPackage,
  initialDraft,
  currentUser,
  onSubmit,
  loading = false,
  error,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      projectDescription: '',
      expectedUsage: '',
      duration: '',
    },
  });

  useEffect(() => {
    reset({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: '',
      projectDescription: initialDraft?.projectDescription || '',
      expectedUsage: initialDraft?.expectedUsage || '',
      duration: initialDraft?.duration || '',
    });
  }, [currentUser?.email, currentUser?.name, initialDraft, reset]);

  const handleValidSubmit = (values) =>
    onSubmit({
      gpuPackage: gpuPackage.id || gpuPackage._id,
      contactName: values.name,
      contactEmail: values.email,
      contactPhone: values.phone,
      projectDescription: values.projectDescription,
      expectedUsage: values.expectedUsage,
      duration: values.duration,
    });

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} className="space-y-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Input
        id="selectedGpuPackage"
        label="Selected GPU Package"
        value={gpuPackage.name || 'Selected GPU'}
        disabled
        readOnly
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="name"
          label="Name"
          disabled={loading}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          disabled={loading}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>
      <Input
        id="phone"
        label="Phone"
        disabled={loading}
        error={errors.phone?.message}
        {...register('phone')}
      />
      <Textarea
        id="projectDescription"
        label="Project Description"
        disabled={loading}
        error={errors.projectDescription?.message}
        {...register('projectDescription')}
      />
      <Textarea
        id="expectedUsage"
        label="Expected Usage"
        disabled={loading}
        error={errors.expectedUsage?.message}
        {...register('expectedUsage')}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="duration"
          label="Rental Duration"
          disabled={loading}
          error={errors.duration?.message}
          {...register('duration')}
        />
      </div>
      <Button type="submit" loading={loading}>
        Submit Enquiry
      </Button>
    </form>
  );
}

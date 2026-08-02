import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Sparkles } from 'lucide-react';
import { Alert, Button, Checkbox, Input, Select, Textarea } from '@/components/ui/index.js';
import { gpuPackageService } from '@/services/index.js';

const toNumber = (value) => (value === '' || value === undefined ? undefined : Number(value));

const gpuPackageSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(180),
  gpuModel: z.string().trim().min(1).max(120),
  gpuMemoryGb: z.preprocess(toNumber, z.number().positive()),
  cpuCores: z.preprocess(toNumber, z.number().positive()),
  ramGb: z.preprocess(toNumber, z.number().positive()),
  storageGb: z.preprocess(toNumber, z.number().positive()),
  storageType: z.enum(['ssd', 'nvme', 'hdd']),
  bandwidth: z.string().trim().max(120).optional(),
  region: z.string().trim().min(1).max(120),
  hourlyPrice: z.preprocess(toNumber, z.number().min(0)),
  monthlyPrice: z.preprocess(toNumber, z.number().min(0)),
  currency: z.string().trim().length(3),
  availabilityStatus: z.enum(['available', 'limited', 'unavailable', 'coming_soon']),
  description: z.string().trim().max(5000).optional(),
  features: z.string().optional(),
  useCases: z.string().optional(),
  isPublished: z.boolean().optional(),
});

const defaults = {
  name: '',
  slug: '',
  gpuModel: '',
  gpuMemoryGb: '',
  cpuCores: '',
  ramGb: '',
  storageGb: '',
  storageType: 'nvme',
  bandwidth: '',
  region: '',
  hourlyPrice: '',
  monthlyPrice: '',
  currency: 'USD',
  availabilityStatus: 'available',
  description: '',
  features: '',
  useCases: '',
  isPublished: false,
};

const toMultiline = (items) => (Array.isArray(items) ? items.join('\n') : '');
const fromMultiline = (value) =>
  String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export function GpuPackageForm({
  initialValue,
  onSubmit,
  loading = false,
  error,
  submitLabel = 'Save Package',
}) {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(gpuPackageSchema), defaultValues: defaults });
  const [generatingCopy, setGeneratingCopy] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    if (initialValue) {
      reset({
        ...defaults,
        ...initialValue,
        features: toMultiline(initialValue.features),
        useCases: toMultiline(initialValue.useCases),
      });
    }
  }, [initialValue, reset]);

  const handleValidSubmit = (values) =>
    onSubmit({
      ...values,
      features: fromMultiline(values.features),
      useCases: fromMultiline(values.useCases),
      currency: values.currency.toUpperCase(),
    });

  const generateCopy = async () => {
    setGeneratingCopy(true);
    setCopyMessage('');

    try {
      const values = getValues();
      const copy = await gpuPackageService.generateCopy({
        ...values,
        gpuMemoryGb: Number(values.gpuMemoryGb),
        cpuCores: Number(values.cpuCores),
        ramGb: Number(values.ramGb),
        storageGb: Number(values.storageGb),
        hourlyPrice: Number(values.hourlyPrice),
        monthlyPrice: Number(values.monthlyPrice),
        features: fromMultiline(values.features),
        useCases: fromMultiline(values.useCases),
        currency: values.currency.toUpperCase(),
      });

      if (copy.description) {
        setValue('description', copy.description, { shouldDirty: true });
      }

      if (copy.features?.length) {
        setValue('features', copy.features.join('\n'), { shouldDirty: true });
      }

      if (copy.useCases?.length) {
        setValue('useCases', copy.useCases.join('\n'), { shouldDirty: true });
      }

      setCopyMessage(
        copy.provider === 'local-fallback'
          ? 'Generated with local fallback. Add a backend AI key for stronger copy.'
          : `Generated with ${copy.provider}. Review before saving.`
      );
    } catch (generationError) {
      setCopyMessage(generationError.message || 'Package copy could not be generated.');
    } finally {
      setGeneratingCopy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} className="space-y-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="name"
          label="Name"
          error={errors.name?.message}
          disabled={loading}
          {...register('name')}
        />
        <Input
          id="slug"
          label="Slug"
          error={errors.slug?.message}
          disabled={loading}
          {...register('slug')}
        />
        <Input
          id="gpuModel"
          label="GPU Model"
          error={errors.gpuModel?.message}
          disabled={loading}
          {...register('gpuModel')}
        />
        <Input
          id="gpuMemoryGb"
          label="VRAM GB"
          type="number"
          error={errors.gpuMemoryGb?.message}
          disabled={loading}
          {...register('gpuMemoryGb')}
        />
        <Input
          id="cpuCores"
          label="CPU Cores"
          type="number"
          error={errors.cpuCores?.message}
          disabled={loading}
          {...register('cpuCores')}
        />
        <Input
          id="ramGb"
          label="RAM GB"
          type="number"
          error={errors.ramGb?.message}
          disabled={loading}
          {...register('ramGb')}
        />
        <Input
          id="storageGb"
          label="Storage GB"
          type="number"
          error={errors.storageGb?.message}
          disabled={loading}
          {...register('storageGb')}
        />
        <Select
          id="storageType"
          label="Storage Type"
          disabled={loading}
          {...register('storageType')}
          options={[
            { label: 'NVMe', value: 'nvme' },
            { label: 'SSD', value: 'ssd' },
            { label: 'HDD', value: 'hdd' },
          ]}
        />
        <Input id="bandwidth" label="Bandwidth" disabled={loading} {...register('bandwidth')} />
        <Input
          id="region"
          label="Region"
          error={errors.region?.message}
          disabled={loading}
          {...register('region')}
        />
        <Input
          id="hourlyPrice"
          label="Hourly Price"
          type="number"
          error={errors.hourlyPrice?.message}
          disabled={loading}
          {...register('hourlyPrice')}
        />
        <Input
          id="monthlyPrice"
          label="Monthly Price"
          type="number"
          error={errors.monthlyPrice?.message}
          disabled={loading}
          {...register('monthlyPrice')}
        />
        <Input
          id="currency"
          label="Currency"
          error={errors.currency?.message}
          disabled={loading}
          {...register('currency')}
        />
        <Select
          id="availabilityStatus"
          label="Availability"
          disabled={loading}
          {...register('availabilityStatus')}
          options={[
            { label: 'Available', value: 'available' },
            { label: 'Limited', value: 'limited' },
            { label: 'Unavailable', value: 'unavailable' },
            { label: 'Coming soon', value: 'coming_soon' },
          ]}
        />
      </div>
      <Textarea
        id="description"
        label="Description"
        disabled={loading}
        {...register('description')}
      />
      <div className="flex flex-col gap-2 rounded-card border border-white/10 bg-white/[0.035] p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-[#8FA39B]">
          Generate editable description, features, and use cases from the package specs.
        </p>
        <Button
          type="button"
          variant="outline"
          loading={generatingCopy}
          leftIcon={<Sparkles className="h-4 w-4" />}
          onClick={generateCopy}
        >
          Generate Copy
        </Button>
      </div>
      {copyMessage && <p className="text-sm text-[#8FA39B]">{copyMessage}</p>}
      <Textarea
        id="features"
        label="Features"
        helperText="One feature per line."
        disabled={loading}
        {...register('features')}
      />
      <Textarea
        id="useCases"
        label="Use Cases"
        helperText="One use case per line."
        disabled={loading}
        {...register('useCases')}
      />
      <Checkbox
        id="isPublished"
        label="Published"
        disabled={loading}
        {...register('isPublished')}
      />
      <Button type="submit" loading={loading}>
        {submitLabel}
      </Button>
    </form>
  );
}

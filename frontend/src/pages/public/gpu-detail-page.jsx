import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Cpu, HardDrive, MapPin, Server } from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  EmptyState,
  PageHeader,
  SectionHeader,
  Skeleton,
  StatusBadge,
} from '@/components/ui/index.js';
import { useGpuPackage } from '@/hooks/index.js';

const formatPrice = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export function GpuDetailPage() {
  const { id } = useParams();
  const { data: gpuPackage, isLoading, error } = useGpuPackage(id);

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  if (error) {
    return <Alert variant="danger">{error.message}</Alert>;
  }

  if (!gpuPackage) {
    return <EmptyState title="GPU package not found" />;
  }

  const specs = [
    { label: 'GPU', value: gpuPackage.gpuModel, icon: Cpu },
    { label: 'VRAM', value: `${gpuPackage.gpuMemoryGb}GB`, icon: Server },
    { label: 'CPU', value: `${gpuPackage.cpuCores} cores`, icon: Cpu },
    { label: 'RAM', value: `${gpuPackage.ramGb}GB`, icon: Server },
    {
      label: 'Storage',
      value: `${gpuPackage.storageGb}GB ${gpuPackage.storageType}`,
      icon: HardDrive,
    },
    { label: 'Region', value: gpuPackage.region, icon: MapPin },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={gpuPackage.name}
        description={gpuPackage.description || 'Detailed GPU package specifications and pricing.'}
        action={
          <Button asChild>
            <Link to={`/enquiry/${gpuPackage.id || gpuPackage._id}`}>Submit Enquiry</Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="space-y-4">
            <SectionHeader title="Full Specifications" />
            <div className="grid gap-4 md:grid-cols-2">
              {specs.map((spec) => {
                const Icon = spec.icon;

                return (
                  <Card key={spec.label}>
                    <CardContent className="flex items-center gap-3 p-5">
                      <Icon className="h-5 w-5 text-brand-600" />
                      <div>
                        <p className="text-sm text-[#8FA39B]">{spec.label}</p>
                        <p className="font-semibold">{spec.value || '-'}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader title="Features" description="Included capabilities for this package." />
            {gpuPackage.features?.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {gpuPackage.features.map((feature) => (
                  <p key={feature} className="flex items-center gap-2 text-[#F5F7F6]">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {feature}
                  </p>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Features pending"
                description="Feature details will be added soon."
              />
            )}
          </section>

          <section className="space-y-4">
            <SectionHeader title="Use Cases" description="Project types this package may fit." />
            {gpuPackage.useCases?.length ? (
              <div className="flex flex-wrap gap-2">
                {gpuPackage.useCases.map((useCase) => (
                  <Badge key={useCase} variant="primary">
                    {useCase}
                  </Badge>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Use cases pending"
                description="Use case guidance will be added soon."
              />
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader
              title="Pricing"
              action={
                <StatusBadge
                  status={gpuPackage.availabilityStatus}
                  label={gpuPackage.availabilityStatus}
                />
              }
            />
            <CardContent className="space-y-4">
              <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                <p className="text-sm text-[#8FA39B]">Hourly</p>
                <p className="text-2xl font-semibold">
                  {formatPrice(gpuPackage.hourlyPrice, gpuPackage.currency)}
                </p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                <p className="text-sm text-[#8FA39B]">Monthly</p>
                <p className="text-2xl font-semibold">
                  {formatPrice(gpuPackage.monthlyPrice, gpuPackage.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Project suitability</p>
                <p className="mt-1 text-sm text-[#8FA39B]">
                  Share your workload, timeline, and budget so the team can confirm fit before
                  credentials are issued.
                </p>
              </div>
              <Button asChild className="w-full">
                <Link to={`/enquiry/${gpuPackage.id || gpuPackage._id}`}>Submit Enquiry</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

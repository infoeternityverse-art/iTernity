import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Cpu, HardDrive, MapPin, Server } from 'lucide-react';
import { EnquiryForm } from '@/components/enquiry/enquiry-form.jsx';
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
import { useCreateEnquiry, useGpuPackage } from '@/hooks/index.js';
import { useAuthStore } from '@/store/auth-store.js';

const formatPrice = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export function CustomerInventoryDetailPage() {
  const { id } = useParams();
  const [submittedEnquiry, setSubmittedEnquiry] = useState(null);
  const user = useAuthStore((state) => state.user);
  const { data: gpuPackage, isLoading, error } = useGpuPackage(id);
  const createEnquiry = useCreateEnquiry({
    onSuccess: setSubmittedEnquiry,
  });

  if (isLoading) return <Skeleton className="h-96 rounded-card" />;
  if (error) return <Alert variant="danger">{error.message}</Alert>;
  if (!gpuPackage) return <EmptyState title="GPU package not found" />;

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
      <Button asChild variant="ghost" size="sm">
        <Link to="/dashboard/inventory">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to GPU packages
        </Link>
      </Button>

      <PageHeader
        eyebrow="GPU Configuration"
        title={gpuPackage.name}
        description={gpuPackage.description || 'Review this configuration and request access.'}
        action={
          <StatusBadge
            status={gpuPackage.availabilityStatus}
            label={gpuPackage.availabilityStatus || 'unknown'}
          />
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-8">
          <section className="space-y-4">
            <SectionHeader
              title="Configuration"
              description="Infrastructure included in this package."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {specs.map((spec) => {
                const Icon = spec.icon;
                return (
                  <Card key={spec.label}>
                    <CardContent className="flex items-center gap-3 p-5">
                      <Icon className="h-5 w-5 text-[#2DE8C4]" aria-hidden="true" />
                      <div>
                        <p className="text-sm text-[#8FA39B]">{spec.label}</p>
                        <p className="font-semibold text-white">{spec.value || '-'}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader title="Features" />
            {gpuPackage.features?.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {gpuPackage.features.map((feature) => (
                  <p key={feature} className="flex items-center gap-2 text-[#F5F7F6]">
                    <CheckCircle className="h-4 w-4 text-[#2DE8C4]" aria-hidden="true" />
                    {feature}
                  </p>
                ))}
              </div>
            ) : (
              <EmptyState title="Features pending" />
            )}
          </section>

          {gpuPackage.useCases?.length > 0 && (
            <section className="space-y-4">
              <SectionHeader title="Recommended workloads" />
              <div className="flex flex-wrap gap-2">
                {gpuPackage.useCases.map((useCase) => (
                  <Badge key={useCase} variant="primary">
                    {useCase}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader title="Pricing" />
            <CardContent className="grid grid-cols-2 gap-3">
              <div className="rounded-button border border-white/10 bg-white/[0.045] p-4">
                <p className="text-sm text-[#8FA39B]">Hourly</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {formatPrice(gpuPackage.hourlyPrice, gpuPackage.currency)}
                </p>
              </div>
              <div className="rounded-button border border-white/10 bg-white/[0.045] p-4">
                <p className="text-sm text-[#8FA39B]">Monthly</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {formatPrice(gpuPackage.monthlyPrice, gpuPackage.currency)}
                </p>
              </div>
            </CardContent>
          </Card>

          {submittedEnquiry ? (
            <Card className="border-[#2DE8C4]/40 bg-[#071712]/95 shadow-[0_24px_70px_rgba(45,232,196,0.12)]">
              <CardContent className="space-y-6 p-7 text-center" aria-live="polite">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#2DE8C4]/35 bg-[#2DE8C4]/10 text-[#2DE8C4] shadow-[0_0_34px_rgba(45,232,196,0.16)]">
                  <CheckCircle className="h-8 w-8" aria-hidden="true" />
                </span>
                <div className="space-y-2">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#2DE8C4]">
                    Submission complete
                  </p>
                  <h2 className="text-2xl font-bold text-white">Request received</h2>
                  <p className="leading-7 text-[#8FA39B]">
                    Your enquiry for {gpuPackage.name} has been added securely. Our team will review
                    the workload and update its status in your dashboard.
                  </p>
                </div>
                <div className="grid gap-3">
                  <Button asChild className="w-full">
                    <Link to="/dashboard/enquiries">View enquiries</Link>
                  </Button>
                  <Button asChild variant="secondary" className="w-full">
                    <Link to="/dashboard/inventory">Explore more GPU packages</Link>
                  </Button>
                </div>
                {/* <p className="text-xs leading-5 text-[#667A72]">
                  You will not be redirected automatically.
                </p> */}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader
                title="Request access"
                description="Tell us about the workload and expected rental period."
              />
              <CardContent>
                <EnquiryForm
                  gpuPackage={gpuPackage}
                  currentUser={user}
                  onSubmit={createEnquiry.mutateAsync}
                  loading={createEnquiry.isPending}
                  error={createEnquiry.error?.message}
                />
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

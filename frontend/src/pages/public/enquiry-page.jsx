import { useNavigate, useParams } from 'react-router-dom';
import { EnquiryForm } from '@/components/enquiry/enquiry-form.jsx';
import { PublicPageHero } from '@/components/common/public-page-hero.jsx';
import { Alert, Card, CardContent, Skeleton } from '@/components/ui/index.js';
import { useCreateEnquiry, useGpuPackage } from '@/hooks/index.js';

export function EnquiryPage() {
  const { gpuPackageId } = useParams();
  const navigate = useNavigate();
  const { data: gpuPackage, isLoading, error } = useGpuPackage(gpuPackageId);
  const createEnquiry = useCreateEnquiry({
    onSuccess: () => navigate('/thank-you', { replace: true }),
  });

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  if (error) {
    return <Alert variant="danger">{error.message}</Alert>;
  }

  if (!gpuPackage) {
    return <Alert variant="warning">The selected GPU package could not be found.</Alert>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PublicPageHero
        eyebrow="Request Access"
        title="Submit Enquiry"
        description="Tell us about your workload and we will review the request before issuing access."
        variant="enquiry"
      />
      <Card>
        <CardContent className="p-6">
          <EnquiryForm
            gpuPackage={gpuPackage}
            onSubmit={createEnquiry.mutateAsync}
            loading={createEnquiry.isPending}
            error={createEnquiry.error?.message}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { EnquiryForm } from '@/components/enquiry/enquiry-form.jsx';
import { PublicPageHero } from '@/components/common/public-page-hero.jsx';
import { Alert, Card, CardContent, Skeleton } from '@/components/ui/index.js';
import { useCreateEnquiry, useGpuPackage } from '@/hooks/index.js';

const ENQUIRY_DRAFT_KEY = 'gpu-marketplace-enquiry-draft';

const readStoredDraft = (gpuPackageId) => {
  try {
    const draft = JSON.parse(sessionStorage.getItem(ENQUIRY_DRAFT_KEY) || 'null');
    return draft?.gpuPackageId === gpuPackageId ? draft : null;
  } catch {
    return null;
  }
};

export function EnquiryPage() {
  const { gpuPackageId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: gpuPackage, isLoading, error } = useGpuPackage(gpuPackageId);
  const enquiryDraft =
    location.state?.enquiryDraft?.gpuPackageId === gpuPackageId
      ? location.state.enquiryDraft
      : readStoredDraft(gpuPackageId);
  const createEnquiry = useCreateEnquiry({
    onSuccess: () => {
      sessionStorage.removeItem(ENQUIRY_DRAFT_KEY);
      navigate('/thank-you', { replace: true });
    },
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
            initialDraft={enquiryDraft}
            onSubmit={createEnquiry.mutateAsync}
            loading={createEnquiry.isPending}
            error={createEnquiry.error?.message}
          />
        </CardContent>
      </Card>
    </div>
  );
}

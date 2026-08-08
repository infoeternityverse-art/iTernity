import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { EnquiryForm } from '@/components/enquiry/enquiry-form.jsx';
import { PublicPageHero } from '@/components/common/public-page-hero.jsx';
import { Seo } from '@/components/common/seo.jsx';
import { Alert, Card, CardContent, Skeleton } from '@/components/ui/index.js';
import { useCreateEnquiry, useGpuPackage } from '@/hooks/index.js';
import { createBreadcrumbSchema } from '@/utils/seo-schema.js';
import { useAuthStore } from '@/store/auth-store.js';
import { useEffect } from 'react';

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
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isRestoring = useAuthStore((state) => state.isRestoring);
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

  useEffect(() => {
    if (!isRestoring && !isAuthenticated) {
      navigate('/login', {
        replace: true,
        state: {
          from: location,
          enquiryDraft: { gpuPackageId, ...enquiryDraft },
        },
      });
    }
  }, [enquiryDraft, gpuPackageId, isAuthenticated, isRestoring, location, navigate]);

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  if (error) {
    return <Alert variant="danger">{error.message}</Alert>;
  }

  if (!gpuPackage) {
    return <Alert variant="warning">The selected GPU package could not be found.</Alert>;
  }
  const enquiryPath = `/enquiry/${gpuPackageId}`;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Seo
        title={`Request ${gpuPackage.name} GPU Access`}
        description={`Submit an enquiry for ${gpuPackage.name} cloud GPU rental access. Share your workload, timeline, and project requirements for review.`}
        path={enquiryPath}
        structuredData={[
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'GPU Marketplace', path: '/gpus' },
            { name: gpuPackage.name, path: `/gpus/${gpuPackageId}` },
            { name: 'Submit Enquiry', path: enquiryPath },
          ]),
        ]}
      />
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
            currentUser={user}
            onSubmit={createEnquiry.mutateAsync}
            loading={createEnquiry.isPending}
            error={createEnquiry.error?.message}
          />
        </CardContent>
      </Card>
    </div>
  );
}

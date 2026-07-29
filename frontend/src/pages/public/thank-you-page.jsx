import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { PublicPageHero } from '@/components/common/public-page-hero.jsx';
import { Button, Card, CardContent } from '@/components/ui/index.js';

export function ThankYouPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PublicPageHero
        eyebrow="Submitted"
        title="Thank you"
        description="Your enquiry has been submitted for review."
        variant="thanks"
      />
      <Card>
        <CardContent className="space-y-4 p-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
          <p className="text-[#F5F7F6]">
            Our team will review your project requirements and contact you with the next steps. If
            the package is a fit, credentials will be issued manually after approval.
          </p>
          <Button asChild>
            <Link to="/gpus">Back to GPU Marketplace</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

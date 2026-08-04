import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { PublicPageHero } from '@/components/common/public-page-hero.jsx';
import { Seo } from '@/components/common/seo.jsx';
import { Button, Card, CardContent } from '@/components/ui/index.js';

export function ContactThankYouPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Seo
        title="Message Received"
        description="Your iTernityverse contact message has been received."
        path="/contact-thank-you"
        noindex
      />
      <PublicPageHero
        eyebrow="Message Sent"
        title="Thank you for contacting us"
        description="Your message has reached the iTernityverse team."
        variant="thanks"
      />
      <Card>
        <CardContent className="space-y-4 p-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
          <p className="text-[#F5F7F6]">
            We will review your message and reply as soon as possible. For GPU access requests,
            please use the GPU marketplace flow so your package and workload details stay attached.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

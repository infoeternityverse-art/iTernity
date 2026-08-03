import { PlaceholderPage } from '@/components/common/placeholder-page.jsx';
import { Seo } from '@/components/common/seo.jsx';

export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page Not Found"
        description="The requested iTernityverse route does not exist."
        noindex
      />
      <PlaceholderPage title="404" description="The requested route does not exist." />
    </>
  );
}

import { PlaceholderPage } from '@/components/common/placeholder-page.jsx';
import { Seo } from '@/components/common/seo.jsx';

export function ForbiddenPage() {
  return (
    <>
      <Seo
        title="Forbidden"
        description="This route is reserved for forbidden access handling."
        path="/403"
        noindex
      />
      <PlaceholderPage
        title="403"
        description="This route is reserved for forbidden access handling."
      />
    </>
  );
}

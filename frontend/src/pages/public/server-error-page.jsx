import { PlaceholderPage } from '@/components/common/placeholder-page.jsx';
import { Seo } from '@/components/common/seo.jsx';

export function ServerErrorPage() {
  return (
    <>
      <Seo
        title="Server Error"
        description="This route is reserved for server error handling."
        path="/500"
        noindex
      />
      <PlaceholderPage
        title="500"
        description="This route is reserved for server error handling."
      />
    </>
  );
}

import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { CursorDot } from '@/components/common/cursor-dot.jsx';
import { SessionRestore } from '@/components/common/session-restore.jsx';
import { QueryProvider } from '@/providers/query-provider.jsx';
import { router } from '@/routes/router.jsx';
import { cloudinaryImageUrl } from '@/utils/media-url.js';
import { useSiteSettings } from '@/hooks/use-site-settings.js';

function FooterBackgroundLoader() {
  const siteSettings = useSiteSettings();

  useEffect(() => {
    const localFooterBackground = '/media/footer_bg.jpg';
    const footerMedia = siteSettings.data?.media?.footer_bg;
    const footerBackground = footerMedia?.publicId
      ? cloudinaryImageUrl(footerMedia.publicId, { width: 1600, version: footerMedia.version })
      : cloudinaryImageUrl('footer_bg', { width: 1600 });
    const setFooterBackground = (src) => {
      document.documentElement.style.setProperty('--footer-bg-image', `url("${src}")`);
    };

    if (!footerBackground) {
      setFooterBackground(localFooterBackground);
      return;
    }

    const image = new Image();
    image.onload = () => {
      setFooterBackground(footerBackground);
    };
    image.onerror = () => {
      setFooterBackground(localFooterBackground);
    };
    image.src = footerBackground;
  }, [siteSettings.data]);

  return null;
}

function App() {
  return (
    <QueryProvider>
      <FooterBackgroundLoader />
      <SessionRestore>
        <CursorDot />
        <RouterProvider router={router} />
      </SessionRestore>
    </QueryProvider>
  );
}

export default App;

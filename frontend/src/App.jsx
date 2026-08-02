import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { CursorDot } from '@/components/common/cursor-dot.jsx';
import { SessionRestore } from '@/components/common/session-restore.jsx';
import { QueryProvider } from '@/providers/query-provider.jsx';
import { router } from '@/routes/router.jsx';
import { cloudinaryImageUrl } from '@/utils/media-url.js';

function App() {
  useEffect(() => {
    const localFooterBackground = '/media/footer_bg.jpg';
    const footerBackground = cloudinaryImageUrl('footer_bg', { width: 1600 });
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
  }, []);

  return (
    <QueryProvider>
      <SessionRestore>
        <CursorDot />
        <RouterProvider router={router} />
      </SessionRestore>
    </QueryProvider>
  );
}

export default App;

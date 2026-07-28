import { Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/components/common/scroll-to-top.jsx';

/**
 * ErrorLayout provides a centered shell with an illustration placeholder for error pages.
 */
export function ErrorLayout() {
  return (
    <div className="premium-shell px-4 py-10">
      <ScrollToTop />
      <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col justify-center">
        <div className="premium-glass mb-8 flex h-40 items-center justify-center rounded-dialog text-sm font-semibold text-[#8FA39B]">
          Error Illustration Placeholder
        </div>
        <Outlet />
      </main>
    </div>
  );
}

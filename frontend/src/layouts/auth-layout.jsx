import { Link, Outlet } from 'react-router-dom';
import { APP_NAME } from '@/constants/app.constants.js';
import { ScrollToTop } from '@/components/common/scroll-to-top.jsx';
import { UniversalAiAssistant } from '@/components/ai/universal-ai-assistant.jsx';

/**
 * AuthLayout centers authentication-related placeholder pages in a focused container.
 */
export function AuthLayout() {
  return (
    <div className="premium-shell flex min-h-screen items-center justify-center px-4 py-10">
      <ScrollToTop />
      <main className="premium-glass w-full max-w-md rounded-dialog p-8">
        <Link to="/" className="mb-8 block text-center text-lg font-black text-white">
          {APP_NAME}
        </Link>
        <Outlet />
      </main>
      <UniversalAiAssistant />
    </div>
  );
}

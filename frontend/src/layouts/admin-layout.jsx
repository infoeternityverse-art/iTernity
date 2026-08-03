import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Bell, LogOut, Menu, Sparkles, X } from 'lucide-react';
import { APP_NAME } from '@/constants/app.constants.js';
import { adminNavigation } from '@/config/navigation.config.js';
import { Button, ToastViewport } from '@/components/ui/index.js';
import { NavLink } from '@/components/common/nav-link.jsx';
import { BrandMark } from '@/components/common/brand-mark.jsx';
import { ScrollToTop } from '@/components/common/scroll-to-top.jsx';
import { UniversalAiAssistant } from '@/components/ai/universal-ai-assistant.jsx';
import { useAuthStore } from '@/store/auth-store.js';

/**
 * AdminLayout provides admin navigation, header, content area, and notification viewport.
 */
export function AdminLayout() {
  const logout = useAuthStore((state) => state.logout);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const closeMobileNav = () => setIsMobileNavOpen(false);

  return (
    <div className="admin-shell premium-shell text-white">
      <ScrollToTop />
      <div className="flex min-h-screen gap-0 xl:p-4">
        <aside className="premium-glass hidden w-72 rounded-card p-5 xl:block">
          <Link to="/admin" className="mb-8 flex items-center gap-3 text-base font-black">
            <BrandMark className="h-10 w-10" />
            {APP_NAME} Admin
          </Link>
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8FA39B]">
            Console
          </p>
          <nav aria-label="Admin navigation" className="space-y-1">
            {adminNavigation.map((item) => (
              <NavLink key={item.href} item={item} compact />
            ))}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="admin-header border-b border-white/10 bg-[#070B14]/72 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8 xl:mx-4 xl:mt-0 xl:rounded-card xl:border">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  variant="icon"
                  className="xl:hidden"
                  aria-label={isMobileNavOpen ? 'Close admin menu' : 'Open admin menu'}
                  aria-expanded={isMobileNavOpen}
                  onClick={() => setIsMobileNavOpen((current) => !current)}
                >
                  {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                <div className="min-w-0">
                  <p className="admin-header-kicker flex items-center gap-2 text-sm font-semibold text-accent-500">
                    <Sparkles className="h-4 w-4" />
                    iTernityverse Admin
                  </p>
                  <p className="admin-header-title text-base font-bold text-white">Operations</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="icon" aria-label="Admin notifications">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  leftIcon={<LogOut className="h-4 w-4" />}
                >
                  Logout
                </Button>
              </div>
            </div>
            {isMobileNavOpen && (
              <nav
                aria-label="Admin mobile navigation"
                className="mt-4 grid gap-1 border-t border-white/10 pt-4 xl:hidden"
              >
                {adminNavigation.map((item) => (
                  <NavLink key={item.href} item={item} compact onClick={closeMobileNav} />
                ))}
              </nav>
            )}
          </header>
          <main className="min-w-0 flex-1 px-4 py-10 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
      <UniversalAiAssistant />
      <ToastViewport />
    </div>
  );
}

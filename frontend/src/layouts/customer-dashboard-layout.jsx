import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Bell, LogOut, Menu, Sparkles, X } from 'lucide-react';
import { APP_NAME } from '@/constants/app.constants.js';
import { customerNavigation } from '@/config/navigation.config.js';
import { Button } from '@/components/ui/index.js';
import { NavLink } from '@/components/common/nav-link.jsx';
import { BrandMark } from '@/components/common/brand-mark.jsx';
import { ScrollToTop } from '@/components/common/scroll-to-top.jsx';
import { useAuthStore } from '@/store/auth-store.js';

/**
 * CustomerDashboardLayout provides the customer sidebar, header, and content workspace.
 */
export function CustomerDashboardLayout() {
  const logout = useAuthStore((state) => state.logout);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const closeMobileNav = () => setIsMobileNavOpen(false);

  return (
    <div className="premium-shell text-white">
      <ScrollToTop />
      <div className="flex min-h-screen gap-0 lg:p-4">
        <aside className="premium-glass hidden w-64 rounded-card p-5 lg:block">
          <Link to="/" className="mb-8 flex items-center gap-3 text-base font-black">
            <BrandMark className="h-10 w-10" />
            {APP_NAME}
          </Link>
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8FA39B]">
            Workspace
          </p>
          <nav aria-label="Customer navigation" className="space-y-1">
            {customerNavigation.map((item) => (
              <NavLink key={item.href} item={item} compact />
            ))}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-white/10 bg-[#070B14]/72 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8 lg:mx-4 lg:mt-0 lg:rounded-card lg:border">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  variant="icon"
                  className="lg:hidden"
                  aria-label={isMobileNavOpen ? 'Close customer menu' : 'Open customer menu'}
                  aria-expanded={isMobileNavOpen}
                  onClick={() => setIsMobileNavOpen((current) => !current)}
                >
                  {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-semibold text-accent-500">
                    <Sparkles className="h-4 w-4" />
                    EternityVerse Dashboard
                  </p>
                  <p className="text-base font-bold text-white">Workspace</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="icon" aria-label="Notifications">
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
                aria-label="Customer mobile navigation"
                className="mt-4 grid gap-1 border-t border-white/10 pt-4 lg:hidden"
              >
                {customerNavigation.map((item) => (
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
    </div>
  );
}

import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Github, Linkedin, Mail, Menu, Twitter, X, Youtube } from 'lucide-react';
import { APP_NAME } from '@/constants/app.constants.js';
import { authNavigation, footerNavigation, publicNavigation } from '@/config/navigation.config.js';
import { env } from '@/config/env.js';
import { Button } from '@/components/ui/index.js';
import { NavLink } from '@/components/common/nav-link.jsx';
import { BrandMark } from '@/components/common/brand-mark.jsx';
import { ScrollToTop } from '@/components/common/scroll-to-top.jsx';

/**
 * PublicLayout provides the public navbar, constrained content container, and footer.
 */
export function PublicLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const closeMobileNav = () => setIsMobileNavOpen(false);
  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com', icon: Github },
    { label: 'X', href: 'https://x.com', icon: Twitter },
    { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: Linkedin },
    { label: 'YouTube', href: 'https://www.youtube.com', icon: Youtube },
  ];
  const pageLinks = [
    { label: 'GPU Marketplace', href: '/gpus' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ];
  const legalLinks = [
    { label: 'Privacy Policy', href: '/faq' },
    { label: 'Terms of Access', href: '/faq' },
    { label: 'Security', href: '/faq' },
    { label: 'Acceptable Use', href: '/faq' },
  ];

  return (
    <div className="premium-shell flex min-h-screen flex-col text-[#F5F7F6]">
      <ScrollToTop />
      <header
        className={`public-hero-header inset-x-0 top-0 z-40 ${
          isHomePage ? 'absolute' : 'relative public-page-header'
        }`}
      >
        <div className="mx-auto w-full max-w-[1760px] px-6 sm:px-10 lg:px-20">
          <div className="grid grid-cols-[1fr_auto] items-center gap-6 py-3 lg:grid-cols-[1fr_auto_1fr]">
            <Link
              to="/"
              onClick={closeMobileNav}
              className="flex items-center text-base font-normal tracking-normal text-[#F5F7F6]"
            >
              <BrandMark className="h-10 w-44" />
            </Link>

            <div className="hidden contents lg:contents">
              <nav aria-label="Public navigation" className="hidden items-center justify-center gap-10">
                {publicNavigation.map((item) => (
                  <NavLink key={item.href} item={item} />
                ))}
              </nav>
              <Button
                asChild
                variant="outline"
                className="public-header-cta h-auto justify-self-end rounded-button border-[#2DE8C4] bg-transparent px-5 py-1.5 text-base font-normal text-[#F5F7F6] shadow-[0_0_26px_rgba(45,232,196,0.14)] hover:border-[#8CFFF1] hover:bg-transparent hover:text-[#F5F7F6]"
              >
                <Link to={authNavigation[0].href}>{authNavigation[0].label}</Link>
              </Button>
            </div>

            <div className="col-start-2 row-start-1 flex items-center justify-end gap-2 lg:hidden">
              <Button
                variant="icon"
                aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileNavOpen}
                onClick={() => setIsMobileNavOpen((current) => !current)}
              >
                {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {isMobileNavOpen && (
            <div className="rounded-[24px] border border-[rgba(45,232,196,0.15)] bg-[#0E1310]/88 p-3 shadow-soft backdrop-blur-xl lg:hidden">
              <nav aria-label="Mobile public navigation" className="flex flex-col gap-1">
                {publicNavigation.map((item) => (
                  <NavLink key={item.href} item={item} compact onClick={closeMobileNav} />
                ))}
              </nav>
              <div className="mt-4">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-center border-[#2DE8C4] bg-[#2DE8C4] text-[#060907] hover:bg-transparent hover:text-[#F5F7F6]"
                >
                  <Link to={authNavigation[0].href} onClick={closeMobileNav}>
                    {authNavigation[0].label}
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <nav className="floating-bottom-nav" aria-label="Primary navigation">
        {publicNavigation.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <main
        className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${
          isHomePage ? 'flex-1 max-w-7xl py-12' : 'public-page-main max-w-7xl pb-36 pt-14'
        }`}
      >
        <Outlet />
      </main>

      <footer className="public-footer relative z-20 mt-16 flex-none border-t border-[rgba(45,232,196,0.15)] bg-[#060907] pb-24">
        <div className="premium-divider" />
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr_0.9fr]">
            <div className="max-w-md space-y-5">
              <Link
                to="/"
                className="inline-flex items-center text-lg font-black tracking-normal text-[#F5F7F6]"
              >
                <BrandMark className="h-11 w-48" />
              </Link>
              <p className="text-sm leading-6 text-[#8FA39B]">
                A professional GPU cloud marketplace for browsing packages, submitting reviewed
                enquiries, and receiving credentials through a controlled admin workflow.
              </p>
              <a
                href={`mailto:${env.supportEmail}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#F5F7F6] transition hover:text-[#2DE8C4]"
              >
                <Mail className="h-4 w-4" />
                {env.supportEmail}
              </a>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase text-[#F5F7F6]">Explore</h2>
              <nav aria-label="Footer navigation" className="grid gap-3 text-sm text-[#8FA39B]">
                {footerNavigation.map((item) => (
                  <Link key={item.href} to={item.href} className="transition hover:text-[#2DE8C4]">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase text-[#F5F7F6]">Pages</h2>
              <nav aria-label="Footer pages" className="grid gap-3 text-sm text-[#8FA39B]">
                {pageLinks.map((item) => (
                  <Link key={item.href} to={item.href} className="transition hover:text-[#2DE8C4]">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase text-[#F5F7F6]">Legal</h2>
              <nav aria-label="Footer legal" className="grid gap-3 text-sm text-[#8FA39B]">
                {legalLinks.map((item) => (
                  <Link key={item.label} to={item.href} className="transition hover:text-[#2DE8C4]">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase text-[#F5F7F6]">Social</h2>
              <div className="flex flex-wrap gap-3" aria-label="Social links">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-button border border-[rgba(45,232,196,0.15)] bg-[#0E1310] text-[#8FA39B] transition hover:border-[#2DE8C4] hover:text-[#2DE8C4]"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
              <p className="max-w-xs text-sm leading-6 text-[#8FA39B]">
                Follow platform updates, product progress, and GPU marketplace announcements.
              </p>
            </div>
          </div>

          <div className="mt-12 border-t border-[#F5F7F6]/10 pt-6 text-sm text-[#8FA39B]">
            <p>
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

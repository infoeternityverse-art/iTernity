import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Github, Instagram, Linkedin, Mail, Menu, X, Youtube } from 'lucide-react';
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
function XLogoIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 90 92" aria-hidden="true" focusable="false">
      <path
        d="M53.564 38.947 87.066 0h-7.941L50.033 33.816 26.801 0H0l35.136 51.137L0 91.977h7.941l30.722-35.712 24.54 35.712H90L53.561 38.947zM42.686 51.588l-3.56-5.093L10.8 5.977h12.194l22.86 32.699 3.56 5.093 29.714 42.503H66.935L42.686 51.591z"
        fill="currentColor"
      />
    </svg>
  );
}

function RedditIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 256 256" aria-hidden="true" focusable="false">
      <path
        d="M248 128c0 14.4-11.6 26-26 26-2.2 0-4.4-.3-6.5-.8-6.7 44.4-44.9 78.4-87.5 78.4s-80.8-34-87.5-78.4c-2.1.5-4.3.8-6.5.8-14.4 0-26-11.6-26-26s11.6-26 26-26c6.4 0 12.3 2.3 16.8 6.2 16.1-11.5 37.1-18.9 60.2-20.5l11.8-55.4c.8-3.8 4.6-6.3 8.4-5.5l39.2 8.3c4.1-8 12.4-13.5 22-13.5 13.7 0 24.8 11.1 24.8 24.8s-11.1 24.8-24.8 24.8c-12.7 0-23.2-9.6-24.6-22l-32.6-6.9-9.6 45.1c25.1.8 48.1 8.3 65.4 20.7 4.6-3.9 10.4-6.2 16.9-6.2 14.5.1 26.1 11.7 26.1 26.1ZM84.8 132.6c0 10.3 8.3 18.6 18.6 18.6s18.6-8.3 18.6-18.6-8.3-18.6-18.6-18.6-18.6 8.3-18.6 18.6Zm85.5 53.9c2.9-2.9 2.9-7.6 0-10.5s-7.6-2.9-10.5 0c-7.2 7.2-18.7 10.8-31.8 10.8s-24.6-3.6-31.8-10.8c-2.9-2.9-7.6-2.9-10.5 0s-2.9 7.6 0 10.5c10.3 10.3 25.7 15.3 42.3 15.3s32-5 42.3-15.3Zm-17.7-35.3c10.3 0 18.6-8.3 18.6-18.6s-8.3-18.6-18.6-18.6-18.6 8.3-18.6 18.6 8.3 18.6 18.6 18.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PublicLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [transitionPath, setTransitionPath] = useState('');
  const hasMountedRef = useRef(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const closeMobileNav = () => setIsMobileNavOpen(false);
  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com', icon: Github, social: 'github' },
    { label: 'X', href: 'https://x.com', icon: XLogoIcon, social: 'x' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: Linkedin, social: 'linkedin' },
    { label: 'YouTube', href: 'https://www.youtube.com', icon: Youtube, social: 'youtube' },
    { label: 'Instagram', href: 'https://www.instagram.com', icon: Instagram, social: 'instagram' },
    { label: 'Reddit', href: 'https://www.reddit.com', icon: RedditIcon, social: 'reddit' },
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
  const getRouteVariant = (pathname) => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/gpus/')) return 'detail';
    if (pathname.startsWith('/gpus')) return 'market';
    if (pathname.startsWith('/about')) return 'about';
    if (pathname.startsWith('/contact')) return 'contact';
    if (pathname.startsWith('/faq')) return 'faq';
    if (pathname.startsWith('/enquiry')) return 'enquiry';
    if (pathname.startsWith('/thank-you')) return 'thanks';
    return 'home';
  };

  useEffect(() => {
    closeMobileNav();

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return undefined;
    }

    setTransitionPath(location.pathname);
    const timer = window.setTimeout(() => setTransitionPath(''), 2000);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="premium-shell flex min-h-screen flex-col text-[#F5F7F6]">
      <ScrollToTop />
      {transitionPath && (
        <div
          className={`cosmic-route-burst cosmic-route-burst-${getRouteVariant(transitionPath)}`}
          aria-hidden="true"
        >
          <span className="cosmic-route-burst-core" />
          <span className="cosmic-route-burst-flare" />
        </div>
      )}
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
              <ul className="footer-social-links" aria-label="Social links">
                <li className="footer-social-text" aria-hidden="true">
                  <span>HOVER</span>
                  <span>FOR</span>
                  <span>SOCIAL</span>
                </li>
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.label} className="footer-social-item">
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={item.label}
                        data-social={item.social}
                      >
                        <Icon className="footer-social-icon" />
                      </a>
                    </li>
                  );
                })}
                <li className="footer-social-back" aria-hidden="true" />
              </ul>
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

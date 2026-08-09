import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Github, Instagram, Linkedin, Menu, X, Youtube } from 'lucide-react';
import { APP_NAME } from '@/constants/app.constants.js';
import { authNavigation, publicNavigation } from '@/config/navigation.config.js';
import { Button } from '@/components/ui/index.js';
import { NavLink } from '@/components/common/nav-link.jsx';
import { BrandMark } from '@/components/common/brand-mark.jsx';
import { ScrollToTop } from '@/components/common/scroll-to-top.jsx';
import { UniversalAiAssistant } from '@/components/ai/universal-ai-assistant.jsx';

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

function FooterShapeVisual({ type }) {
  return (
    <svg
      className={`footer-ocean-shape-svg footer-ocean-shape-${type}`}
      viewBox="0 0 180 104"
      aria-hidden="true"
      focusable="false"
    >
      <path className="footer-ocean-shape-fill" d="M21 31 48 10h84l27 21-69 62L21 31Z" />
      <path
        className="footer-ocean-facet footer-ocean-facet-light"
        d="M48 10 63 31H21L48 10Zm84 0-15 21h42l-27-21ZM63 31h54L90 93 63 31Z"
      />
      <path
        className="footer-ocean-facet footer-ocean-facet-dark"
        d="M48 10h84l-15 21H63L48 10ZM21 31h42l27 62-69-62Zm96 0h42L90 93l27-62Z"
      />
      <path
        className="footer-ocean-shape-line"
        d="M21 31h138M48 10l15 21 27 62 27-62 15-21M63 31h54"
      />
    </svg>
  );
}

function FooterVantaBackground() {
  const containerRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let cancelled = false;
    let idleId = 0;

    const startEffect = async () => {
      try {
        const threeModule = await import('three-r134');
        if (cancelled) return;

        // Vanta captures window.THREE while its UMD module is evaluated.
        window.THREE = threeModule;
        const birdsModule = await import('vanta/dist/vanta.birds.min');
        if (cancelled) return;

        const createBirdsEffect = [
          birdsModule.default,
          birdsModule.default?.default,
          birdsModule,
          window.VANTA?.BIRDS,
          window._vantaEffect,
        ].find((candidate) => typeof candidate === 'function');
        if (typeof createBirdsEffect !== 'function') return;

        effectRef.current = createBirdsEffect({
          el: container,
          THREE: threeModule,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color1: 0x155545,
          color2: 0x00ffb3,
          colorMode: 'variance',
          birdSize: 0.5,
          backgroundAlpha: 0.0,
        });
      } catch {
        // The static footer treatment remains available if WebGL cannot initialize.
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (window.requestIdleCallback) {
          idleId = window.requestIdleCallback(startEffect, { timeout: 1800 });
        } else {
          idleId = window.setTimeout(startEffect, 250);
        }
      },
      { rootMargin: '320px 0px' }
    );

    observer.observe(container.closest('footer') || container);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (window.cancelIdleCallback && idleId) window.cancelIdleCallback(idleId);
      else if (idleId) window.clearTimeout(idleId);
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="footer-vanta-bg" aria-hidden="true" />;
}

export function PublicLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [transitionPath, setTransitionPath] = useState('');
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const hasMountedRef = useRef(false);
  const footerRef = useRef(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const closeMobileNav = () => setIsMobileNavOpen(false);
  const socialLinks = [
    { label: 'X', href: 'https://x.com', icon: XLogoIcon, social: 'x' },
    { label: 'Reddit', href: 'https://www.reddit.com', icon: RedditIcon, social: 'reddit' },
    { label: 'GitHub', href: 'https://github.com', icon: Github, social: 'github' },
    { label: 'YouTube', href: 'https://www.youtube.com', icon: Youtube, social: 'youtube' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: Linkedin, social: 'linkedin' },
    { label: 'Instagram', href: 'https://www.instagram.com', icon: Instagram, social: 'instagram' },
  ];
  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Access', href: '/terms' },
    { label: 'Security', href: '/security' },
    { label: 'Acceptable Use', href: '/acceptable-use' },
    { label: 'FAQ', href: '/faq' },
  ];
  const footerOceanLinks = [
    { label: 'Home', href: '/' },
    { label: 'GPU Marketplace', href: '/gpus' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Get Started', href: '/login' },
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

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.08 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

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
              <BrandMark className="h-16 w-20" />
            </Link>

            <div className="hidden contents lg:contents">
              <nav
                aria-label="Public navigation"
                className="hidden items-center justify-center gap-10"
              >
                {publicNavigation.map((item) => (
                  <NavLink key={item.href} item={item} />
                ))}
              </nav>
              <Button
                asChild
                variant="outline"
                className="public-header-cta public-get-started-button h-auto justify-self-end"
              >
                <Link to={authNavigation[0].href}>
                  <span className="public-get-started-border" aria-hidden="true" />
                  <span className="public-get-started-inner">
                    <span>Let&apos;s get started</span>
                    <ArrowRight className="public-get-started-icon" />
                  </span>
                </Link>
              </Button>
            </div>

            <div className="relative z-50 col-start-2 row-start-1 flex items-center justify-end gap-2 lg:hidden">
              <Button
                variant="icon"
                aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileNavOpen}
                onClick={() => setIsMobileNavOpen((current) => !current)}
              >
                {isMobileNavOpen ? (
                  <X className="h-6 w-6 stroke-[2.8]" />
                ) : (
                  <Menu className="h-6 w-6 stroke-[2.8]" />
                )}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isMobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, x: 36, y: -18, scale: 0.97, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{
                opacity: 0,
                x: 36,
                y: -18,
                scale: 0.97,
                filter: 'blur(6px)',
                transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] },
              }}
              transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
              className="mobile-nav-overlay fixed inset-0 z-40 flex origin-top-right items-start justify-center px-4 pb-6 pt-24 lg:hidden"
            >
              <div className="mobile-nav-panel relative w-full max-w-[21rem] overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_16%_0%,rgba(45,232,196,0.24),transparent_34%),radial-gradient(circle_at_100%_18%,rgba(24,200,162,0.13),transparent_38%),linear-gradient(145deg,rgba(7,42,34,0.96),rgba(3,21,17,0.95)_58%,rgba(7,50,41,0.9))] shadow-[0_28px_84px_rgba(0,0,0,0.36),0_0_44px_rgba(45,232,196,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_118%,rgba(45,232,196,0.16),transparent_48%)]" />
                <nav
                  aria-label="Mobile public navigation"
                  className="mobile-nav-list relative z-10 px-5 pb-6 pt-7"
                >
                  {publicNavigation.map((item, index) => (
                    <motion.div
                      key={item.href}
                      className="relative"
                      initial={{ opacity: 0, x: -14, y: -4 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{
                        duration: 0.32,
                        delay: 0.06 + index * 0.045,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {index > 0 && (
                        <span
                          className="pointer-events-none absolute -top-1 left-4 right-4 h-px bg-[linear-gradient(90deg,transparent,rgba(245,247,246,0.12)_22%,rgba(45,232,196,0.32)_50%,rgba(245,247,246,0.12)_78%,transparent)]"
                          aria-hidden="true"
                        />
                      )}
                      <Link
                        to={item.href}
                        onClick={closeMobileNav}
                        className="mobile-nav-link block rounded-[18px] px-4 text-center text-sm font-semibold leading-none text-[#F5F7F6] drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)] transition duration-300 ease-premium hover:-translate-y-0.5 hover:text-[#2DE8C4]"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                <div className="relative z-10 px-4 pb-4 pt-1">
                  <Button
                    asChild
                    className="w-full justify-center border-0 bg-[linear-gradient(135deg,#2DE8C4_0%,#18C8A2_100%)] py-3.5 text-sm text-[#060907] shadow-[0_18px_42px_rgba(45,232,196,0.22)]"
                  >
                    <Link to={authNavigation[0].href} onClick={closeMobileNav}>
                      {authNavigation[0].label}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <nav
        className={`floating-bottom-nav ${isFooterVisible ? 'floating-bottom-nav-hidden' : ''}`}
        aria-label="Primary navigation"
      >
        {publicNavigation.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <main
        className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${
          isHomePage ? 'flex-1 max-w-7xl py-12' : 'public-page-main max-w-7xl pb-36 pt-0'
        }`}
      >
        <Outlet />
      </main>

      <footer
        ref={footerRef}
        className="public-footer relative z-20 mt-16 flex-none overflow-hidden border-t border-[rgba(45,232,196,0.15)] bg-[#060907] pb-24"
      >
        <FooterVantaBackground />
        <div className="footer-css-motion" aria-hidden="true">
          <span className="footer-css-ray footer-css-ray-1" />
          <span className="footer-css-ray footer-css-ray-2" />
          <span className="footer-css-drift footer-css-drift-1" />
          <span className="footer-css-drift footer-css-drift-2" />
          <span className="footer-css-drift footer-css-drift-3" />
          <span className="footer-css-drift footer-css-drift-4" />
          <span className="footer-css-pulse footer-css-pulse-1" />
          <span className="footer-css-pulse footer-css-pulse-2" />
        </div>
        <div className="footer-inner relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="footer-content-grid">
            <div className="footer-brand-block max-w-md">
              <Link
                to="/"
                className="inline-flex items-center text-lg font-black tracking-normal text-[#F5F7F6]"
              >
                <BrandMark className="h-20 w-28" />
              </Link>
              <p className="text-sm leading-6 text-[#8FA39B]">Beyond Infinite Intelligence</p>
              <h3 className="footer-minimal-heading">QUICK LINKS</h3>
              <nav className="footer-minimal-links" aria-label="Footer quick links">
                {footerOceanLinks.map((item) => (
                  <Link key={item.label} to={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="footer-ocean-nav-panel">
              <h3 className="footer-minimal-heading footer-social-heading">SOCIAL LINKS</h3>
              <ul className="footer-ocean-social" aria-label="Social links">
                <li className="footer-social-prompt" aria-hidden="true">
                  <span>Hover</span>
                  <span>For</span>
                  <span>Social</span>
                </li>
                {socialLinks.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <li
                      key={item.label}
                      className={`footer-ocean-social-item footer-ocean-social-${index + 1}`}
                    >
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={item.label}
                        data-social={item.social}
                        className="footer-ocean-social-link footer-gem-teal"
                      >
                        <FooterShapeVisual type="gem" />
                        <Icon className="footer-ocean-social-icon" />
                        <span className="footer-social-name">{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="footer-legal-row mt-10">
            <nav className="footer-legal-links" aria-label="Footer legal">
              {legalLinks.map((item) => (
                <Link key={item.label} to={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="footer-copyright-block">
              <p>
                © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
              </p>
              <a
                className="footer-developer-credit"
                href="https://vuntech.online"
                target="_blank"
                rel="noopener noreferrer"
              >
                Developed by Vuntech
              </a>
            </div>
          </div>
        </div>
      </footer>
      <UniversalAiAssistant />
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Github,
  Instagram,
  Linkedin,
  Menu,
  X,
  Youtube,
} from 'lucide-react';
import { APP_NAME } from '@/constants/app.constants.js';
import { authNavigation, publicNavigation } from '@/config/navigation.config.js';
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

function FooterShapeVisual({ type }) {
  return (
    <svg
      className={`footer-ocean-shape-svg footer-ocean-shape-${type}`}
      viewBox="0 0 180 104"
      aria-hidden="true"
      focusable="false"
    >
      <path className="footer-ocean-shape-fill" d="M21 31 48 10h84l27 21-69 62L21 31Z" />
      <path className="footer-ocean-facet footer-ocean-facet-light" d="M48 10 63 31H21L48 10Zm84 0-15 21h42l-27-21ZM63 31h54L90 93 63 31Z" />
      <path className="footer-ocean-facet footer-ocean-facet-dark" d="M48 10h84l-15 21H63L48 10ZM21 31h42l27 62-69-62Zm96 0h42L90 93l27-62Z" />
      <path className="footer-ocean-shape-line" d="M21 31h138M48 10l15 21 27 62 27-62 15-21M63 31h54" />
    </svg>
  );
}

export function PublicLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [transitionPath, setTransitionPath] = useState('');
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const hasMountedRef = useRef(false);
  const footerRef = useRef(null);
  const footerVantaRef = useRef(null);
  const footerVantaEffectRef = useRef(null);
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
  const legalLinks = [
    { label: 'Privacy Policy', href: '/faq' },
    { label: 'Terms of Access', href: '/faq' },
    { label: 'Security', href: '/faq' },
    { label: 'Acceptable Use', href: '/faq' },
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
      { threshold: 0.08 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const vantaTarget = footerVantaRef.current;
    if (!vantaTarget) return undefined;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotionQuery.matches) return undefined;

    let isCancelled = false;

    const loadScript = (id, src) =>
      new Promise((resolve, reject) => {
        const existingScript = document.getElementById(id);
        if (existingScript) {
          if (existingScript.dataset.loaded === 'true') {
            resolve();
            return;
          }

          existingScript.addEventListener('load', resolve, { once: true });
          existingScript.addEventListener('error', reject, { once: true });
          return;
        }

        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.async = true;
        script.onload = () => {
          script.dataset.loaded = 'true';
          resolve();
        };
        script.onerror = reject;
        document.body.appendChild(script);
      });

    const initVanta = async () => {
      try {
        const previousThree = window.THREE;
        await loadScript('three-r134', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        await loadScript('vanta-birds', 'https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.birds.min.js');

        if (isCancelled || !window.VANTA?.BIRDS || !footerVantaRef.current) return;

        footerVantaEffectRef.current = window.VANTA.BIRDS({
          el: footerVantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x183b18,
          color1: 0x0,
          color2: 0x398913,
          birdSize: 0.5,
          wingSpan: 10.0,
          alignment: 54.0,
          cohesion: 64.0,
          backgroundAlpha: 0.0,
        });

        if (previousThree) {
          window.THREE = previousThree;
        }
      } catch {
        // Keep the footer usable if the decorative background script cannot load.
      }
    };

    initVanta();

    return () => {
      isCancelled = true;
      footerVantaEffectRef.current?.destroy();
      footerVantaEffectRef.current = null;
    };
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
              <nav aria-label="Public navigation" className="hidden items-center justify-center gap-10">
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
                    <span>Let's get started</span>
                    <ArrowRight className="public-get-started-icon" />
                  </span>
                </Link>
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
          isHomePage ? 'flex-1 max-w-7xl py-12' : 'public-page-main max-w-7xl pb-36 pt-14'
        }`}
      >
        <Outlet />
      </main>

      <footer
        ref={footerRef}
        className="public-footer relative z-20 mt-16 flex-none overflow-hidden border-t border-[rgba(45,232,196,0.15)] bg-[#060907] pb-24"
      >
        <div ref={footerVantaRef} className="footer-vanta-bg" aria-hidden="true" />
        <div className="footer-inner relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="footer-content-grid">
            <div className="footer-brand-block max-w-md">
              <Link
                to="/"
                className="inline-flex items-center text-lg font-black tracking-normal text-[#F5F7F6]"
              >
                <BrandMark className="h-20 w-28" />
              </Link>
              <p className="text-sm leading-6 text-[#8FA39B]">
                Beyond Infinite Intelligence
              </p>
              <h3 className="footer-minimal-heading">QUICK LINKS</h3>
              <nav className="footer-minimal-links" aria-label="Footer quick links">
                {footerOceanLinks.map((item) => (
                  <Link key={item.label} to={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <a href={`mailto:${env.supportEmail}`} className="footer-minimal-mail">
                <span>Mail us</span>
                <span>{env.supportEmail}</span>
              </a>
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
                    <li key={item.label} className={`footer-ocean-social-item footer-ocean-social-${index + 1}`}>
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

          <div className="footer-legal-row">
            <nav className="footer-legal-links" aria-label="Footer legal">
              {legalLinks.map((item) => (
                <Link key={item.label} to={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <p>
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

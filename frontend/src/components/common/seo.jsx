import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { absoluteUrl } from '@/utils/seo-schema.js';

const DEFAULT_DESCRIPTION =
  'Rent curated cloud GPU packages for AI inference, model training, rendering, and research workloads through iTernityverse.';
const DEFAULT_IMAGE = '/media/logo.png';

const setMeta = ({ selector, tag = 'meta', attributes }) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement(tag);
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  return element;
};

const removeSeoJsonLd = () => {
  document
    .querySelectorAll('script[data-seo-json-ld="true"]')
    .forEach((element) => element.remove());
};

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  structuredData = [],
}) {
  const location = useLocation();
  const canonicalPath = path || location.pathname;
  const canonicalUrl = absoluteUrl(canonicalPath);
  const imageUrl = absoluteUrl(image);
  const finalTitle = title.includes('iTernityverse') ? title : `${title} | iTernityverse`;
  const jsonLd = useMemo(() => structuredData.filter(Boolean), [structuredData]);

  useEffect(() => {
    document.title = finalTitle;

    setMeta({
      selector: 'meta[name="description"]',
      attributes: { name: 'description', content: description },
    });
    setMeta({
      selector: 'meta[name="robots"]',
      attributes: { name: 'robots', content: noindex ? 'noindex,nofollow' : 'index,follow' },
    });
    setMeta({
      selector: 'link[rel="canonical"]',
      tag: 'link',
      attributes: { rel: 'canonical', href: canonicalUrl },
    });
    setMeta({
      selector: 'meta[property="og:title"]',
      attributes: { property: 'og:title', content: finalTitle },
    });
    setMeta({
      selector: 'meta[property="og:description"]',
      attributes: { property: 'og:description', content: description },
    });
    setMeta({
      selector: 'meta[property="og:url"]',
      attributes: { property: 'og:url', content: canonicalUrl },
    });
    setMeta({
      selector: 'meta[property="og:type"]',
      attributes: { property: 'og:type', content: type },
    });
    setMeta({
      selector: 'meta[property="og:image"]',
      attributes: { property: 'og:image', content: imageUrl },
    });
    setMeta({
      selector: 'meta[name="twitter:card"]',
      attributes: { name: 'twitter:card', content: 'summary_large_image' },
    });
    setMeta({
      selector: 'meta[name="twitter:title"]',
      attributes: { name: 'twitter:title', content: finalTitle },
    });
    setMeta({
      selector: 'meta[name="twitter:description"]',
      attributes: { name: 'twitter:description', content: description },
    });
    setMeta({
      selector: 'meta[name="twitter:image"]',
      attributes: { name: 'twitter:image', content: imageUrl },
    });

    removeSeoJsonLd();
    jsonLd.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seoJsonLd = 'true';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [canonicalUrl, description, finalTitle, imageUrl, jsonLd, noindex, type]);

  return null;
}

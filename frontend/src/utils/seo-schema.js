import { env } from '@/config/env.js';

export const absoluteUrl = (value = '/') => {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${env.siteUrl}${value.startsWith('/') ? value : `/${value}`}`;
};

export const createOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'iTernityverse',
  url: env.siteUrl,
  logo: absoluteUrl('/media/logo.png'),
  email: env.supportEmail,
});

export const createWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'iTernityverse',
  url: env.siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${env.siteUrl}/gpus?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

export const createBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const createFaqSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
});

export const createBlogPostingSchema = ({ post, path, image }) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.seoDescription || post.excerpt,
  image: image ? [image] : undefined,
  datePublished: post.publishedAt || post.createdAt,
  dateModified: post.updatedAt || post.publishedAt || post.createdAt,
  author: {
    '@type': 'Organization',
    name: post.author || 'iTernityverse Editorial',
  },
  publisher: {
    '@type': 'Organization',
    name: 'iTernityverse',
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/media/logo.png'),
    },
  },
  mainEntityOfPage: absoluteUrl(path),
});

export const createGpuProductSchema = ({ gpuPackage, path }) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: gpuPackage.name,
  description: gpuPackage.description,
  sku: gpuPackage.id || gpuPackage._id,
  brand: {
    '@type': 'Brand',
    name: 'iTernityverse',
  },
  category: 'Cloud GPU rental',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'GPU model', value: gpuPackage.gpuModel },
    { '@type': 'PropertyValue', name: 'GPU memory', value: `${gpuPackage.gpuMemoryGb} GB` },
    { '@type': 'PropertyValue', name: 'CPU cores', value: String(gpuPackage.cpuCores) },
    { '@type': 'PropertyValue', name: 'RAM', value: `${gpuPackage.ramGb} GB` },
    {
      '@type': 'PropertyValue',
      name: 'Storage',
      value: `${gpuPackage.storageGb} GB ${gpuPackage.storageType}`,
    },
    { '@type': 'PropertyValue', name: 'Region', value: gpuPackage.region },
  ].filter((property) => property.value),
  offers: {
    '@type': 'Offer',
    url: absoluteUrl(path),
    price: String(gpuPackage.hourlyPrice || gpuPackage.monthlyPrice || 0),
    priceCurrency: gpuPackage.currency || 'INR',
    availability:
      gpuPackage.availabilityStatus === 'available'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/LimitedAvailability',
  },
});

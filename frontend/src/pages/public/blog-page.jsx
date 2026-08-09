import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BlogCard } from '@/components/blog/blog-card.jsx';
import { PublicPageHero } from '@/components/common/public-page-hero.jsx';
import { Seo } from '@/components/common/seo.jsx';
import { Alert, Skeleton } from '@/components/ui/index.js';
import { blogCategories } from '@/data/blog-content.js';
import { useBlogPosts } from '@/hooks/index.js';
import { createBreadcrumbSchema } from '@/utils/seo-schema.js';

export function BlogPage() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const params = useMemo(
    () => ({
      limit: 24,
      search: query,
      category: category === 'All' ? '' : category,
      sort: 'publishedAt',
      order: 'desc',
    }),
    [category, query]
  );
  const { data, isLoading, error } = useBlogPosts(params);
  const filteredPosts = data?.data || [];

  return (
    <div className="blog-section space-y-8">
      <Seo
        title="GPU Cloud Blog"
        description="Read iTernityverse notes on GPU infrastructure, AI inference economics, secure AI workspaces, model operations, and compute strategy."
        path="/blog"
        structuredData={[
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
        ]}
      />
      <PublicPageHero
        eyebrow="Research Log"
        title="Blog"
        description="Advanced notes on GPU infrastructure, secure AI workspaces, model operations, and the next era of compute strategy."
        variant="blog"
      />

      <section className="blog-command-bar">
        <div className="blog-search">
          <Search aria-hidden="true" />
          <input
            type="search"
            value={query}
            placeholder="Search intelligence briefings"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="blog-category-tabs" aria-label="Blog categories">
          {['All', ...blogCategories].map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? 'is-active' : ''}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {error && <Alert variant="danger">{error.message}</Alert>}

      {isLoading && (
        <div className="blog-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-80" />
          ))}
        </div>
      )}

      {!isLoading && filteredPosts.length > 0 ? (
        <section className="blog-grid">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id || post._id} post={post} />
          ))}
        </section>
      ) : !isLoading ? (
        <section className="blog-empty">No briefings match this search.</section>
      ) : null}
    </div>
  );
}

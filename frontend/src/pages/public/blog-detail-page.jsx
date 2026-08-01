import { ArrowLeft, CalendarDays, Check, Copy, Facebook, Linkedin, MessageCircle, Share2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BlogCard } from '@/components/blog/blog-card.jsx';
import { Alert, Badge, EmptyState, Skeleton } from '@/components/ui/index.js';
import { useBlogPost, useBlogPosts } from '@/hooks/index.js';

const formatDate = (value) => {
  if (!value) {
    return 'Unscheduled';
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(value));
};

export function BlogDetailPage() {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const { data: post, isLoading, error } = useBlogPost(slug);
  const related = useBlogPosts({ limit: 3, sort: 'publishedAt', order: 'desc' });
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    return window.location.href;
  }, [slug]);

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  if (error) {
    return <Alert variant="danger">{error.message}</Alert>;
  }

  if (!post) {
    return (
      <EmptyState
        title="Blog post not found"
        description="This briefing may be unpublished or no longer available."
      />
    );
  }

  const relatedPosts = (related.data?.data || [])
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2);
  const sections = post.body || [];
  const hasSections = sections.length > 0;
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedShareTitle = encodeURIComponent(post.title || '');

  const copyShareUrl = async () => {
    if (!shareUrl || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <article className="blog-article">
      <Link to="/blog" className="blog-back-link">
        <ArrowLeft aria-hidden="true" />
        Back to blog
      </Link>

      <header
        className={`blog-article-hero blog-card-${post.heroTone} ${
          post.imageUrl ? 'has-image' : ''
        }`}
      >
        <div className="blog-article-glow" aria-hidden="true" />
        <div className="blog-article-heading">
          <Badge variant="primary">{post.category}</Badge>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="blog-article-meta">
            <span>{post.author}</span>
            <span>
              <CalendarDays aria-hidden="true" />
              {formatDate(post.publishedAt || post.updatedAt)}
            </span>
          </div>
          <div className="blog-card-tags">
            {(post.tags || []).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        {post.imageUrl && (
          <figure className="blog-article-media">
            <img src={post.imageUrl} alt={post.imageAlt || post.title} />
          </figure>
        )}
        <aside className="blog-article-share" aria-label="Share this article">
          <p>Share</p>
          <div>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareTitle}`}
              target="_blank"
              rel="noreferrer"
            >
              <Share2 aria-hidden="true" />
              X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`}
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`}
              target="_blank"
              rel="noreferrer"
            >
              <Facebook aria-hidden="true" />
              Facebook
            </a>
            <a
              href={`https://wa.me/?text=${encodedShareTitle}%20${encodedShareUrl}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              WhatsApp
            </a>
            <button type="button" onClick={copyShareUrl}>
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>
        </aside>
      </header>

      <div className={`blog-article-layout ${hasSections ? '' : 'without-sidebar'}`}>
        <div className="blog-article-body">
          {sections.map((section) => (
            <section
              key={section.heading}
              id={section.heading.toLowerCase().replaceAll(' ', '-')}
            >
              <h2>{section.heading}</h2>
              <p>{section.copy}</p>
            </section>
          ))}
        </div>

        {hasSections && (
          <aside className="blog-article-sidebar">
            <p>In This Briefing</p>
            {sections.map((section) => (
              <a
                key={section.heading}
                href={`#${section.heading.toLowerCase().replaceAll(' ', '-')}`}
              >
                {section.heading}
              </a>
            ))}
          </aside>
        )}
      </div>

      {relatedPosts.length > 0 && (
        <section className="blog-related">
          <div>
            <p className="blog-featured-kicker">Related Intelligence</p>
            <h2>Continue reading</h2>
          </div>
          <div className="blog-grid">
            {relatedPosts.map((item) => (
              <BlogCard key={item.id || item._id} post={item} compact />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

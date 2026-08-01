import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatBlogDate = (value) => {
  if (!value) {
    return 'Unscheduled';
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(value));
};

export function BlogCard({ post, to = `/blog/${post.slug}`, compact = false }) {
  return (
    <Link className={`blog-card blog-card-${post.heroTone}`} to={to}>
      {post.imageUrl ? (
        <img
          className="blog-card-image"
          src={post.imageUrl}
          alt={post.imageAlt || post.title}
          loading="lazy"
        />
      ) : (
        <div className="blog-card-image blog-card-image-placeholder" aria-hidden="true" />
      )}
      <div className="blog-card-content">
        <p className="blog-card-category">{post.category}</p>

        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>

        {!compact && (post.tags || []).length > 0 && (
          <div className="blog-card-tags">
            {(post.tags || []).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}

        <div className="blog-card-meta">
          <span>
            <CalendarDays aria-hidden="true" />
            {formatBlogDate(post.publishedAt || post.updatedAt)}
          </span>
        </div>

        <span className="blog-card-link">
          Read article
          <ArrowUpRight aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

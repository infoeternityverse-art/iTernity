import { Bookmark, ChartNoAxesCombined, Eye, RadioTower } from 'lucide-react';
import { BlogCard } from '@/components/blog/blog-card.jsx';
import { Alert, PageHeader, Skeleton, StatCard } from '@/components/ui/index.js';
import { useBlogPosts } from '@/hooks/index.js';

export function BlogHubPage() {
  const { data, isLoading, error } = useBlogPosts({ limit: 12, sort: 'publishedAt', order: 'desc' });
  const posts = data?.data || [];
  const recommended = posts.slice(0, 3);

  return (
    <div className="dashboard-blog space-y-8">
      <PageHeader
        eyebrow="Knowledge Hub"
        title="AI Infrastructure Intelligence"
        description="Curated briefings for customers operating GPU workspaces, model pipelines, and secure compute programs."
      />

      {error && <Alert variant="danger">{error.message}</Alert>}

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="New Briefings"
          value={posts.length}
          icon={<RadioTower className="h-5 w-5" />}
        />
        <StatCard label="Saved Reads" value="8" icon={<Bookmark className="h-5 w-5" />} />
        <StatCard
          label="Read Depth"
          value="76%"
          icon={<ChartNoAxesCombined className="h-5 w-5" />}
        />
      </section>

      <section className="dashboard-blog-lab">
        <div>
          <p className="blog-featured-kicker">Recommended for your workspace</p>
          <h2>Operational reads for GPU teams</h2>
          <p>
            These briefings focus on capacity planning, credential safety, model evaluation, and
            practical infrastructure choices for AI builders.
          </p>
        </div>
        <div className="dashboard-blog-beam" aria-hidden="true" />
      </section>

      <section className="blog-grid">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-72" />)
          : recommended.map((post) => <BlogCard key={post.id || post._id} post={post} compact />)}
      </section>

      <section className="dashboard-blog-feed">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-[#2DE8C4]" />
          <h2>All customer briefings</h2>
        </div>
        {posts.map((post) => (
          <article key={post.id || post._id}>
            <div>
              <p>{post.category}</p>
              <h3>{post.title}</h3>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

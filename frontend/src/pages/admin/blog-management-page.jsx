import { Link } from 'react-router-dom';
import { BarChart3, Eye, FilePenLine, Plus, RadioTower, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { BlogCard } from '@/components/blog/blog-card.jsx';
import {
  Button,
  ConfirmationDialog,
  PageHeader,
  StatCard,
  StatusBadge,
  Table,
} from '@/components/ui/index.js';
import { useAdminBlogPosts, useDeleteBlogPost, useUpdateBlogPost } from '@/hooks/index.js';

export function BlogManagementPage() {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const blogPosts = useAdminBlogPosts({ limit: 50, sort: 'updatedAt', order: 'desc' });
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost({ onSuccess: () => setDeleteTarget(null) });
  const posts = blogPosts.data?.data || [];
  const published = posts.filter((post) => post.status === 'published').length;
  const draft = posts.filter((post) => post.status === 'draft').length;
  const totalViews = posts.reduce((total, post) => total + Number(post.metrics?.views || 0), 0);

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (post) => (
        <div>
          <p className="font-semibold text-white">{post.title}</p>
          <p className="text-xs text-[#8FA39B]">{post.slug}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category' },
    {
      key: 'status',
      header: 'Status',
      render: (post) => <StatusBadge status={post.status} label={post.status} />,
    },
    { key: 'updatedAt', header: 'Updated' },
    { key: 'views', header: 'Views', render: (post) => post.metrics?.views || 0 },
    {
      key: 'actions',
      header: 'Actions',
      render: (post) => (
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="icon" size="sm" aria-label="Preview post">
            <Link to={`/blog/${post.slug}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={`/admin/blog/${post.slug}/edit`}>
              <FilePenLine className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updatePost.mutate({
                slug: post.slug,
                payload: { status: post.status === 'published' ? 'draft' : 'published' },
              })
            }
          >
            {post.status === 'published' ? 'Unpublish' : 'Publish'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteTarget(post)}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-blog-studio space-y-8">
      <PageHeader
        eyebrow="Content Command"
        title="Blog Studio"
        description="Plan, publish, and optimize advanced technology briefings for customers and marketplace visitors."
        action={
          <Button asChild leftIcon={<Plus className="h-4 w-4" />}>
            <Link to="/admin/blog/new">New Article</Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Published" value={published} icon={<RadioTower className="h-5 w-5" />} />
        <StatCard label="Drafts" value={draft} icon={<FilePenLine className="h-5 w-5" />} />
        <StatCard label="Total Views" value={totalViews} icon={<BarChart3 className="h-5 w-5" />} />
      </section>

      {posts[0] && (
        <section className="admin-blog-feature">
          <div>
            <p className="blog-featured-kicker">Editorial Priority</p>
            <h2>Lead with infrastructure intelligence</h2>
            <p>
              Keep the blog focused on GPU strategy, secure workspaces, and model operations so the
              content directly supports high-intent users.
            </p>
          </div>
          <BlogCard post={posts[0]} compact />
        </section>
      )}

      <Table
        loading={blogPosts.isLoading}
        error={blogPosts.error?.message}
        data={posts}
        getRowKey={(post) => post.id || post._id}
        columns={columns}
      />
      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        title="Delete article"
        description="This permanently removes the blog article from the content database."
        confirmLabel="Delete"
        loading={deletePost.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deletePost.mutate(deleteTarget.slug)}
      />
    </div>
  );
}

import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BlogEditorForm } from '@/components/blog/blog-editor-form.jsx';
import { Alert, Button, EmptyState, PageHeader, Skeleton } from '@/components/ui/index.js';
import { useAdminBlogPost } from '@/hooks/index.js';

export function EditBlogPostPage() {
  const { slug } = useParams();
  const { data: post, isLoading, error } = useAdminBlogPost(slug);

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  if (error) {
    return <Alert variant="danger">{error.message}</Alert>;
  }

  if (!post) {
    return <EmptyState title="Article not found" description="This article does not exist." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Blog Studio"
        title="Edit Article"
        description={post.title}
        action={
          <Button asChild variant="outline">
            <Link to="/admin/blog">
              <ArrowLeft className="h-4 w-4" />
              Back to Studio
            </Link>
          </Button>
        }
      />
      <BlogEditorForm post={post} />
    </div>
  );
}

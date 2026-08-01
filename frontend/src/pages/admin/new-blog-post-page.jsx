import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BlogEditorForm } from '@/components/blog/blog-editor-form.jsx';
import { Button, PageHeader } from '@/components/ui/index.js';

export function NewBlogPostPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Blog Studio"
        title="Create Article"
        description="Draft a new premium technology briefing for users, customers, and operators."
        action={
          <Button asChild variant="outline">
            <Link to="/admin/blog">
              <ArrowLeft className="h-4 w-4" />
              Back to Studio
            </Link>
          </Button>
        }
      />
      <BlogEditorForm />
    </div>
  );
}

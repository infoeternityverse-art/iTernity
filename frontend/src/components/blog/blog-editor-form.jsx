import { ImageUp, Save, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogImageCropModal } from '@/components/blog/blog-image-crop-modal.jsx';
import { blogCategories } from '@/data/blog-content.js';
import { mediaUrl } from '@/utils/media-url.js';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Select,
  Textarea,
} from '@/components/ui/index.js';
import { useCreateBlogPost, useUpdateBlogPost } from '@/hooks/index.js';
import { blogPostService } from '@/services/index.js';

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const serializeBody = (sections = []) =>
  sections.map((section) => `${section.heading}\n${section.copy}`).join('\n\n');

const parseBody = (value) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return [];
  }

  const sections = trimmedValue
    .split(/\n{2,}/)
    .map((block) => {
      const [heading, ...copyLines] = block.split('\n');
      return {
        heading: heading?.trim(),
        copy: copyLines.join('\n').trim(),
      };
    })
    .filter((section) => section.heading && section.copy);

  if (sections.length > 0) {
    return sections;
  }

  return [
    {
      heading: 'Overview',
      copy: trimmedValue,
    },
  ];
};

export function BlogEditorForm({ post }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const createPost = useCreateBlogPost({
    onSuccess: (createdPost) => navigate(`/admin/blog/${createdPost.slug}/edit`),
  });
  const updatePost = useUpdateBlogPost({
    onSuccess: (updatedPost) => navigate(`/admin/blog/${updatedPost.slug}/edit`),
  });
  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    category: post?.category || blogCategories[0],
    status: post?.status || 'draft',
    author: post?.author || 'iTernityverse Editorial',
    heroTone: post?.heroTone || 'teal',
    imageUrl: post?.imageUrl || '',
    imageAlt: post?.imageAlt || '',
    tags: post?.tags?.join(', ') || '',
    body: serializeBody(post?.body),
    seoTitle: post?.seoTitle || '',
    seoDescription: post?.seoDescription || '',
  });
  const [cropSource, setCropSource] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const isSaving = createPost.isPending || updatePost.isPending;
  const mutationError = createPost.error || updatePost.error;

  useEffect(
    () => () => {
      if (cropSource?.url) {
        URL.revokeObjectURL(cropSource.url);
      }
    },
    [cropSource]
  );

  const payload = useMemo(
    () => ({
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      category: form.category,
      status: form.status,
      author: form.author,
      heroTone: form.heroTone,
      imageUrl: form.imageUrl,
      imageAlt: form.imageAlt,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      body: parseBody(form.body),
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
    }),
    [form]
  );

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'title' && !post ? { slug: slugify(value) } : {}),
    }));
  };

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageFile = (event) => {
    const [file] = event.target.files || [];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setUploadError('Upload a PNG, JPG, or WebP image.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Choose an image under 8 MB before cropping.');
      return;
    }

    if (cropSource?.url) {
      URL.revokeObjectURL(cropSource.url);
    }

    setUploadError('');
    setCropSource({
      url: URL.createObjectURL(file),
      fileName: file.name,
    });
  };

  const applyCroppedImage = async (payload) => {
    setUploadingImage(true);
    setUploadError('');

    try {
      const uploaded = await blogPostService.uploadImage(payload);
      setForm((current) => ({
        ...current,
        imageUrl: uploaded.imageUrl,
        imageAlt: current.imageAlt || current.title,
      }));
      setCropSource(null);
    } catch (error) {
      setUploadError(error.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const submit = (status) => (event) => {
    event.preventDefault();
    const nextPayload = { ...payload, status };

    if (post) {
      updatePost.mutate({ slug: post.slug, payload: nextPayload });
      return;
    }

    createPost.mutate(nextPayload);
  };

  return (
    <form className="blog-editor-form" onSubmit={submit('draft')}>
      <Card className="blog-editor-main">
        <CardHeader
          title="Editorial Content"
          description="Compose a premium intelligence briefing for the iTernityverse audience."
        />
        <CardContent className="space-y-5">
          <Input id="blog-title" label="Title" value={form.title} onChange={updateField('title')} />
          <Textarea
            id="blog-excerpt"
            label="Excerpt"
            rows={3}
            value={form.excerpt}
            onChange={updateField('excerpt')}
            helperText="Keep this sharp. It appears in blog cards and search previews."
          />
          <Textarea
            id="blog-body"
            label="Article Body"
            rows={13}
            value={form.body}
            onChange={updateField('body')}
            helperText="Use heading + copy blocks, or paste plain article text to save it as Overview."
          />
        </CardContent>
      </Card>

      <aside className="blog-editor-side">
        <Card>
          <CardHeader title="Publishing" />
          <CardContent className="space-y-4">
            <Select
              id="blog-status"
              label="Status"
              value={form.status}
              onChange={updateField('status')}
              options={[
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Scheduled', value: 'scheduled' },
              ]}
            />
            <Select
              id="blog-category"
              label="Category"
              value={form.category}
              onChange={updateField('category')}
              options={blogCategories.map((category) => ({ label: category, value: category }))}
            />
            <Input id="blog-slug" label="Slug" value={form.slug} onChange={updateField('slug')} />
            <Input
              id="blog-author"
              label="Author"
              value={form.author}
              onChange={updateField('author')}
            />
            <Input
              id="blog-image-url"
              label="Image URL"
              value={form.imageUrl}
              onChange={updateField('imageUrl')}
              helperText="Use /media/file.webp or an HTTPS image URL."
            />
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageFile}
            />
            <div className="blog-image-uploader">
              {form.imageUrl ? (
                <img
                  src={mediaUrl(form.imageUrl, { width: 640 })}
                  alt={form.imageAlt || form.title || 'Blog preview'}
                />
              ) : (
                <div className="blog-image-uploader-empty">
                  <ImageUp aria-hidden="true" />
                  <span>No blog image selected</span>
                </div>
              )}
              <div className="blog-image-uploader-actions">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<ImageUp className="h-4 w-4" />}
                  onClick={openImagePicker}
                >
                  Upload & Crop
                </Button>
                {form.imageUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    leftIcon={<X className="h-4 w-4" />}
                    onClick={() =>
                      setForm((current) => ({ ...current, imageUrl: '', imageAlt: '' }))
                    }
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
            {uploadError && <p className="text-sm text-red-300">{uploadError}</p>}
            <Input
              id="blog-image-alt"
              label="Image alt text"
              value={form.imageAlt}
              onChange={updateField('imageAlt')}
            />
            <Input
              id="blog-tags"
              label="Tags"
              value={form.tags}
              onChange={updateField('tags')}
              helperText="Comma-separated tags."
            />
            {mutationError && <p className="text-sm text-red-300">{mutationError.message}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="AI Assist" />
          <CardContent className="space-y-3">
            <p className="text-sm leading-6 text-[#8FA39B]">
              Generate summaries, title variants, and SEO metadata from the final article draft.
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              Generate Metadata
            </Button>
            <Button
              type="submit"
              className="w-full"
              loading={isSaving}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Draft
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              loading={isSaving}
              leftIcon={<Send className="h-4 w-4" />}
              onClick={submit('published')}
            >
              Publish
            </Button>
          </CardContent>
        </Card>
      </aside>
      <BlogImageCropModal
        open={Boolean(cropSource)}
        imageSrc={cropSource?.url}
        fileName={cropSource?.fileName}
        loading={uploadingImage}
        onClose={() => setCropSource(null)}
        onApply={applyCroppedImage}
      />
    </form>
  );
}

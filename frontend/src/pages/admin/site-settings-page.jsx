import { useMemo, useState } from 'react';
import { ImageUp, RefreshCw, ShieldCheck, UploadCloud } from 'lucide-react';
import { Alert, Button, PageHeader, Select, Spinner } from '@/components/ui/index.js';
import { useAdminSiteSettings, useUploadSiteMedia } from '@/hooks/index.js';
import { cloudinaryImageUrl } from '@/utils/media-url.js';

const MAX_UPLOAD_BYTES = 8_000_000;

const MEDIA_SLOTS = [
  {
    value: 'hero_home',
    label: 'Home hero',
    fallback: '/media/hero_home.webp',
    usage: 'Homepage, FAQ, and thank-you hero background',
  },
  {
    value: 'hero_gpu',
    label: 'GPU hero',
    fallback: '/media/hero_gpu.webp',
    usage: 'GPU listing, GPU detail, and GPU enquiry hero background',
  },
  {
    value: 'hero_about',
    label: 'About hero',
    fallback: '/media/hero_about.webp',
    usage: 'About page hero background',
  },
  {
    value: 'hero_contact',
    label: 'Contact hero',
    fallback: '/media/hero_contact.webp',
    usage: 'Contact page hero background',
  },
  {
    value: 'footer_bg',
    label: 'Footer background',
    fallback: '/media/footer_bg.jpg',
    usage: 'Global public footer background',
  },
];

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read selected file.'));
    reader.readAsDataURL(file);
  });

const formatBytes = (bytes = 0) => {
  if (!bytes) return '0 KB';
  const units = ['B', 'KB', 'MB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

export function SiteSettingsPage() {
  const [slot, setSlot] = useState(MEDIA_SLOTS[0].value);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const siteSettings = useAdminSiteSettings();
  const uploadMedia = useUploadSiteMedia({
    onSuccess: () => {
      setSelectedFile(null);
      setPreviewUrl('');
      setSuccess('Site media updated successfully.');
    },
  });

  const selectedSlot = useMemo(
    () => MEDIA_SLOTS.find((item) => item.value === slot) || MEDIA_SLOTS[0],
    [slot]
  );
  const media = siteSettings.data?.media?.[slot];
  const currentImage = media?.publicId
    ? cloudinaryImageUrl(media.publicId, { width: 900, version: media.version })
    : media?.imageUrl || selectedSlot.fallback;

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    setError('');
    setSuccess('');
    setSelectedFile(null);
    setPreviewUrl('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Select an image file.');
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setError('Image must be under 8 MB.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSelectedFile({ file, image: dataUrl });
      setPreviewUrl(dataUrl);
    } catch (readError) {
      setError(readError.message);
    }
  };

  const handleUpload = () => {
    setError('');
    setSuccess('');

    if (!selectedFile) {
      setError('Choose an image before uploading.');
      return;
    }

    uploadMedia.mutate({
      slot,
      image: selectedFile.image,
      fileName: selectedFile.file.name,
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Protected Site Controls"
        title="Site Settings"
        description="Upload production site media directly to Cloudinary and assign it to fixed frontend slots without converting files or redeploying static assets."
      />

      <section className="premium-glass rounded-card border border-white/10 p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-button border border-accent-500/30 bg-accent-500/10 text-accent-500">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-white">Advanced Media Upload</h2>
                <p className="text-sm text-[#8FA39B]">Admin-only, Cloudinary-backed, fixed slots.</p>
              </div>
            </div>

            <Select
              label="Media slot"
              value={slot}
              options={MEDIA_SLOTS.map((item) => ({ value: item.value, label: item.label }))}
              onChange={(event) => {
                setSlot(event.target.value);
                setSelectedFile(null);
                setPreviewUrl('');
                setError('');
                setSuccess('');
              }}
            />

            <div className="rounded-card border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-semibold text-white">{selectedSlot.usage}</p>
              <p className="mt-2 text-sm text-[#8FA39B]">
                Upload PNG, JPG, WebP, AVIF, or GIF. Cloudinary delivers optimized formats and sizes
                to the frontend.
              </p>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-card border border-dashed border-accent-500/35 bg-accent-500/5 px-5 py-8 text-center transition hover:border-accent-500 hover:bg-accent-500/10">
              <ImageUp className="h-8 w-8 text-accent-500" />
              <span className="font-semibold text-white">
                {selectedFile ? selectedFile.file.name : 'Choose image'}
              </span>
              <span className="text-sm text-[#8FA39B]">
                {selectedFile ? formatBytes(selectedFile.file.size) : 'Maximum upload size: 8 MB'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>

            {error && (
              <Alert variant="danger" title="Upload blocked">
                {error}
              </Alert>
            )}
            {uploadMedia.error && (
              <Alert variant="danger" title="Upload failed">
                {uploadMedia.error.message}
              </Alert>
            )}
            {success && (
              <Alert variant="success" title="Updated">
                {success}
              </Alert>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                loading={uploadMedia.isPending}
                disabled={!selectedFile || uploadMedia.isPending}
                leftIcon={<UploadCloud className="h-4 w-4" />}
                onClick={handleUpload}
              >
                Upload to Cloudinary
              </Button>
              <Button
                variant="outline"
                leftIcon={<RefreshCw className="h-4 w-4" />}
                onClick={() => siteSettings.refetch()}
              >
                Refresh
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-card border border-white/10 bg-[#060907]">
              {siteSettings.isLoading ? (
                <div className="flex aspect-video items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <img
                  src={previewUrl || currentImage}
                  alt=""
                  className="aspect-video w-full object-cover"
                  draggable="false"
                />
              )}
            </div>

            <div className="rounded-card border border-white/10 bg-black/20 p-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8FA39B]">
                    Public ID
                  </p>
                  <p className="mt-1 break-all font-mono text-white">
                    {media?.publicId || 'Static fallback'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8FA39B]">
                    Dimensions
                  </p>
                  <p className="mt-1 text-white">
                    {media?.width && media?.height ? `${media.width} x ${media.height}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8FA39B]">
                    File
                  </p>
                  <p className="mt-1 break-all text-white">{media?.originalFileName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8FA39B]">
                    Size
                  </p>
                  <p className="mt-1 text-white">{formatBytes(media?.bytes)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

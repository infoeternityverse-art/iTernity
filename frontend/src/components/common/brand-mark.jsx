/**
 * BrandMark renders the uploaded logo asset cropped to its actual transparent bounds.
 */
export function BrandMark({ className = 'h-10 w-44' }) {
  return (
    <span className={`brand-mark inline-flex shrink-0 items-center justify-center ${className}`}>
      <svg viewBox="362 818 1402 328" aria-hidden="true" className="h-full w-full">
        <image href="/media/logo.png" width="2000" height="2000" preserveAspectRatio="xMidYMid meet" />
      </svg>
    </span>
  );
}

/**
 * BrandMark renders the uploaded logo asset without applying a manual crop.
 */
export function BrandMark({ className = 'h-10 w-44' }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${className}`}>
      <img src="/media/logo.png" alt="" className="h-full w-full object-contain" />
    </span>
  );
}

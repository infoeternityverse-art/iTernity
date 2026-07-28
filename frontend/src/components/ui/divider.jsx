import { cn } from './ui-utils.js';

/**
 * Divider separates content horizontally or vertically with optional label text.
 */
export function Divider({ label, orientation = 'horizontal', className = '' }) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('h-full w-px bg-white/10', className)}
      />
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="premium-divider flex-1" />
      {label && (
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#8FA39B]">
          {label}
        </span>
      )}
      <div className="premium-divider flex-1" />
    </div>
  );
}

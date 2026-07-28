import { cn } from './ui-utils.js';

const variants = {
  neutral: 'border border-white/10 bg-white/[0.07] text-[#F5F7F6]',
  primary:
    'border border-brand-500/30 bg-brand-500/15 text-[#DAD7FF] shadow-[0_0_22px_rgba(109,94,247,0.12)]',
  success:
    'border border-emerald-400/25 bg-emerald-400/12 text-emerald-200 shadow-[0_0_22px_rgba(34,197,94,0.10)]',
  warning:
    'border border-amber-400/25 bg-amber-400/12 text-amber-200 shadow-[0_0_22px_rgba(245,158,11,0.10)]',
  danger:
    'border border-red-400/25 bg-red-400/12 text-red-200 shadow-[0_0_22px_rgba(239,68,68,0.10)]',
  outline: 'border border-white/15 bg-transparent text-[#8FA39B]',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
};

/**
 * Badge highlights short labels, metadata, and statuses with consistent colors.
 */
export function Badge({ children, variant = 'neutral', size = 'md', className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold backdrop-blur',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

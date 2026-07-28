import { forwardRef } from 'react';
import { cn, disabledClasses, focusRing } from './ui-utils.js';

/**
 * Checkbox renders a labeled boolean input with error and helper text support.
 */
export const Checkbox = forwardRef(function Checkbox(
  { id, label, error, helperText, disabled = false, loading = false, className = '', ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-start gap-3 text-sm text-[#F5F7F6]">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          disabled={disabled || loading}
          aria-invalid={Boolean(error)}
          className={cn(
            'mt-0.5 h-4 w-4 rounded border-white/15 bg-white/[0.06] text-brand-500 accent-brand-500',
            focusRing,
            disabledClasses,
            className
          )}
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
      {error && <p className="text-sm text-red-300">{error}</p>}
      {!error && helperText && <p className="text-sm text-[#8FA39B]">{helperText}</p>}
    </div>
  );
});

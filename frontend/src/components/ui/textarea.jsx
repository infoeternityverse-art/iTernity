import { forwardRef } from 'react';
import { cn, disabledClasses, fieldBase, fieldError, focusRing } from './ui-utils.js';

/**
 * Textarea provides a reusable multi-line field with validation and helper messaging.
 */
export const Textarea = forwardRef(function Textarea(
  {
    id,
    label,
    error,
    helperText,
    loading = false,
    disabled = false,
    className = '',
    rows = 4,
    ...props
  },
  ref
) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-[#F5F7F6]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        disabled={disabled || loading}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={cn(
          fieldBase,
          focusRing,
          disabledClasses,
          'min-h-28 px-4 py-3 text-sm leading-6',
          error && fieldError,
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-300">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${id}-helper`} className="text-sm text-[#8FA39B]">
          {helperText}
        </p>
      )}
    </div>
  );
});

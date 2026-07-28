import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn, disabledClasses, fieldBase, fieldError, focusRing } from './ui-utils.js';

/**
 * Select renders a native accessible select styled for consistent form usage.
 */
export const Select = forwardRef(function Select(
  {
    id,
    label,
    options = [],
    placeholder,
    error,
    helperText,
    disabled = false,
    loading = false,
    className = '',
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
      <div className="relative">
        <select
          ref={ref}
          id={id}
          disabled={disabled || loading}
          aria-invalid={Boolean(error)}
          className={cn(
            fieldBase,
            focusRing,
            disabledClasses,
            'h-11 appearance-none px-4 pr-10 text-sm',
            error && fieldError,
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" className="bg-[#0A0A0A] text-white">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="bg-[#0A0A0A] text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8FA39B]" />
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      {!error && helperText && <p className="text-sm text-[#8FA39B]">{helperText}</p>}
    </div>
  );
});

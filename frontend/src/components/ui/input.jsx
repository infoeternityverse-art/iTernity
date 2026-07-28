import { Eye, EyeOff, Search } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { Button } from './button.jsx';
import { cn, disabledClasses, fieldBase, fieldError, focusRing } from './ui-utils.js';

const sizes = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-4 text-sm',
  lg: 'h-[52px] px-5 text-base',
};

/**
 * Input renders text-like fields, including email, number, password, and search variants.
 */
export const Input = forwardRef(function Input(
  {
    id,
    label,
    type = 'text',
    size = 'md',
    error,
    helperText,
    loading = false,
    disabled = false,
    className = '',
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isSearch = type === 'search';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-[#F5F7F6]">
          {label}
        </label>
      )}
      <div className="relative">
        {isSearch && (
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8FA39B]" />
        )}
        <input
          ref={ref}
          id={id}
          type={resolvedType}
          disabled={disabled || loading}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={cn(
            fieldBase,
            focusRing,
            disabledClasses,
            sizes[size],
            isSearch && 'pl-9',
            isPassword && 'pr-10',
            error && fieldError,
            className
          )}
          {...props}
        />
        {isPassword && (
          <Button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            variant="icon"
            size="sm"
            className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full p-0"
            onClick={() => setShowPassword((value) => !value)}
            disabled={disabled || loading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
      </div>
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

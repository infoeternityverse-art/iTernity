import { Search, X } from 'lucide-react';
import { Button } from './button.jsx';
import { cn, disabledClasses, fieldBase, focusRing } from './ui-utils.js';

/**
 * SearchBar provides a reusable search input with clear and submit actions.
 */
export function SearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Search',
  disabled = false,
  loading = false,
  error,
  className = '',
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)} role="search">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8FA39B]" />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          disabled={disabled || loading}
          aria-invalid={Boolean(error)}
          className={cn(fieldBase, focusRing, disabledClasses, 'h-11 px-12 text-sm')}
        />
        {value && (
          <Button
            aria-label="Clear search"
            variant="icon"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-300">{error}</p>}
    </form>
  );
}

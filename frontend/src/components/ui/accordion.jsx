import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn, focusRing } from './ui-utils.js';

/**
 * Accordion reveals one or more sections of content with keyboard-friendly buttons.
 */
export function Accordion({
  items = [],
  multiple = false,
  defaultOpen = [],
  disabled = false,
  loading = false,
  error,
  className = '',
}) {
  const [openItems, setOpenItems] = useState(defaultOpen);

  const toggleItem = (value) => {
    setOpenItems((current) => {
      if (multiple) {
        return current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value];
      }

      return current.includes(value) ? [] : [value];
    });
  };

  if (error) return <p className="text-sm text-red-300">{error}</p>;

  return (
    <div
      className={cn(
        'divide-y divide-white/10 overflow-hidden rounded-card border border-white/10 bg-[#080808] shadow-soft backdrop-blur-xl',
        className
      )}
    >
      {items.map((item) => {
        const isOpen = openItems.includes(item.value);

        return (
          <div key={item.value}>
            <button
              type="button"
              disabled={disabled || loading || item.disabled}
              aria-expanded={isOpen}
              onClick={() => toggleItem(item.value)}
              className={cn(
                'flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-white transition hover:bg-white/[0.045] disabled:cursor-not-allowed disabled:opacity-50',
                focusRing
              )}
            >
              {item.label}
              <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm leading-6 text-[#8FA39B]">{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { ChevronRight } from 'lucide-react';
import { cn, focusRing } from './ui-utils.js';

/**
 * Breadcrumb communicates page hierarchy through links or inert current-page labels.
 */
export function Breadcrumb({ items = [], className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-[#8FA39B]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href || item.label} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className={cn('rounded text-[#8FA39B] transition hover:text-white', focusRing)}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="font-semibold text-white"
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

import { cn } from './ui-utils.js';

/**
 * PageHeader standardizes page titles, descriptions, breadcrumbs, and primary actions.
 */
export function PageHeader({ eyebrow, title, description, breadcrumbs, action, className = '' }) {
  return (
    <header
      className={cn('flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between', className)}
    >
      <div>
        {breadcrumbs && <div className="mb-3">{breadcrumbs}</div>}
        {eyebrow && (
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent-500">{eyebrow}</p>
        )}
        {title && (
          <h1 className="mt-2 max-w-5xl text-3xl font-normal tracking-normal text-[#17161D] sm:text-4xl lg:text-5xl">
            {title}
          </h1>
        )}
        {description && (
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#6B7280]">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

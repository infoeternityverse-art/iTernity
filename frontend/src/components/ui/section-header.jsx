import { cn } from './ui-utils.js';

/**
 * SectionHeader provides compact headings for panels, tables, and content sections.
 */
export function SectionHeader({ title, description, action, className = '' }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div>
        {title && <h2 className="text-xl font-extrabold tracking-normal text-[#17161D]">{title}</h2>}
        {description && <p className="mt-1.5 text-sm leading-6 text-[#6B7280]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

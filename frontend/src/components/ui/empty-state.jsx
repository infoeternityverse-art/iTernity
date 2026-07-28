import { Inbox } from 'lucide-react';
import { cn } from './ui-utils.js';

/**
 * EmptyState explains an empty view and can include one parent-provided action.
 */
export function EmptyState({
  icon,
  title = 'Nothing here yet',
  description,
  action,
  className = '',
}) {
  const Icon = icon || Inbox;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-card border border-dashed border-white/15 bg-white/[0.035] p-10 text-center backdrop-blur',
        className
      )}
    >
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-accent-500/20 bg-accent-500/10 text-accent-500 shadow-cyan">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="text-lg font-extrabold text-white">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-[#8FA39B]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

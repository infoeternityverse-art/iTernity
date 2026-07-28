import { cn, focusRing } from './ui-utils.js';

/**
 * Tabs switches between parent-provided panels using buttons with ARIA tab semantics.
 */
export function Tabs({
  tabs = [],
  value,
  onChange,
  size = 'md',
  disabled = false,
  loading = false,
  error,
  className = '',
}) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };
  const activeTab = tabs.find((tab) => tab.value === value) || tabs[0];

  return (
    <div className={cn('w-full', className)}>
      <div
        role="tablist"
        className="inline-flex flex-wrap gap-1 rounded-button border border-white/10 bg-white/[0.055] p-1 backdrop-blur"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={activeTab?.value === tab.value}
            disabled={disabled || loading || tab.disabled}
            onClick={() => onChange?.(tab.value)}
            className={cn(
              'rounded-[12px] font-semibold text-[#8FA39B] transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50',
              focusRing,
              sizes[size],
              activeTab?.value === tab.value && 'bg-brand-500 text-white shadow-cyan'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-5">
        {error ? <p className="text-sm text-red-300">{error}</p> : activeTab?.content}
      </div>
    </div>
  );
}

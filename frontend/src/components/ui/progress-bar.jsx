/**
 * ProgressBar communicates completion percentage with ARIA progress semantics.
 */
export function ProgressBar({ value = 0, max = 100, label, className = '' }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      {label && <div className="mb-2 text-sm font-semibold text-[#F5F7F6]">{label}</div>}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-2.5 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.07]"
      >
        <div
          className="h-full rounded-full bg-brand-500 shadow-cyan transition-all duration-300 ease-premium"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

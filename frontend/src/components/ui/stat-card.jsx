import { Card } from './card.jsx';
import { Spinner } from './spinner.jsx';
import { cn } from './ui-utils.js';

/**
 * StatCard displays a neutral metric with optional icon, trend, loading, and error states.
 */
export function StatCard({ label, value, icon, trend, loading = false, error, className = '' }) {
  return (
    <Card className={cn('p-6', className)} error={Boolean(error)} interactive>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#8FA39B]">{label}</p>
          <div className="mt-3 text-3xl font-black tracking-normal text-white">
            {loading ? (
              <Spinner />
            ) : error ? (
              <span className="text-base text-red-300">{error}</span>
            ) : (
              value
            )}
          </div>
          {trend && !loading && !error && <p className="mt-2 text-sm text-[#8FA39B]">{trend}</p>}
        </div>
        {icon && (
          <span className="rounded-button border border-white/10 bg-white/[0.07] p-3 text-accent-500 shadow-cyan">
            {icon}
          </span>
        )}
      </div>
    </Card>
  );
}

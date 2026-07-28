import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/components/ui/ui-utils.js';

const steps = [
  { key: 'pending', label: 'Submitted' },
  { key: 'contacted', label: 'In Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export function StatusTimeline({ status }) {
  const normalizedStatus = status === 'fulfilled' ? 'approved' : status;
  const activeIndex = steps.findIndex((step) => step.key === normalizedStatus);

  return (
    <ol className="grid gap-3 sm:grid-cols-4">
      {steps.map((step, index) => {
        const isActive = index <= activeIndex || step.key === normalizedStatus;
        const Icon = isActive ? CheckCircle : Circle;

        return (
          <li
            key={step.key}
            className={cn(
              'flex items-center gap-2 rounded-button border p-3 text-sm font-semibold transition',
              isActive
                ? 'border-accent-500/35 bg-accent-500/10 text-cyan-100 shadow-cyan'
                : 'border-white/10 bg-white/[0.035] text-[#8FA39B]'
            )}
          >
            <Icon className="h-4 w-4" />
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}

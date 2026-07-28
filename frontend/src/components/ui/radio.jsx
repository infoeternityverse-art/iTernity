import { cn, disabledClasses, focusRing } from './ui-utils.js';

/**
 * RadioGroup renders accessible radio options using native keyboard behavior.
 */
export function RadioGroup({
  name,
  options = [],
  value,
  onChange,
  error,
  disabled = false,
  loading = false,
  className = '',
}) {
  return (
    <fieldset className={cn('space-y-2', className)} aria-invalid={Boolean(error)}>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-3 rounded-field border border-white/10 bg-white/[0.035] p-3 text-sm text-[#F5F7F6] transition hover:border-white/15 hover:bg-white/[0.055]"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(event) => onChange?.(event.target.value)}
              disabled={disabled || loading || option.disabled}
              className={cn(
                'mt-0.5 h-4 w-4 border-white/15 bg-white/[0.06] text-brand-500 accent-brand-500',
                focusRing,
                disabledClasses
              )}
            />
            <span>
              <span className="block font-medium">{option.label}</span>
              {option.description && (
                <span className="block leading-6 text-[#8FA39B]">{option.description}</span>
              )}
            </span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
    </fieldset>
  );
}

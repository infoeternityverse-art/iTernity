import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn, focusRing } from './ui-utils.js';

/**
 * DropdownMenu renders keyboard-accessible command items from parent-provided data.
 */
export function DropdownMenu({ trigger, items = [], align = 'right', className = '' }) {
  const [open, setOpen] = useState(false);
  const aligns = {
    left: 'left-0',
    right: 'right-0',
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') setOpen(false);
  };

  return (
    <div className="relative inline-block" onKeyDown={handleKeyDown}>
      <span onClick={() => setOpen((value) => !value)}>{trigger}</span>
      {open && (
        <motion.div
          role="menu"
          className={cn(
            'absolute z-40 mt-2 min-w-48 overflow-hidden rounded-card border border-white/10 bg-[#080808] p-1.5 shadow-glow backdrop-blur-2xl',
            aligns[align],
            className
          )}
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
        >
          {items.map((item) => (
            <button
              key={item.value || item.label}
              role="menuitem"
              type="button"
              disabled={item.disabled}
              onClick={() => {
                item.onSelect?.(item);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-button px-3 py-2 text-left text-sm text-[#F5F7F6] transition hover:bg-white/[0.075] hover:text-white disabled:pointer-events-none disabled:opacity-50',
                focusRing,
                item.danger && 'text-red-300'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

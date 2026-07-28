import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from './ui-utils.js';

/**
 * Popover displays lightweight contextual content triggered by a button-like element.
 */
export function Popover({ trigger, children, align = 'right', className = '' }) {
  const [open, setOpen] = useState(false);
  const aligns = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div className="relative inline-block">
      <span
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => event.key === 'Escape' && setOpen(false)}
      >
        {trigger}
      </span>
      {open && (
        <motion.div
          role="dialog"
          className={cn(
            'absolute z-40 mt-2 min-w-56 rounded-card border border-white/10 bg-[#080808] p-4 text-[#F5F7F6] shadow-glow backdrop-blur-2xl',
            aligns[align],
            className
          )}
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

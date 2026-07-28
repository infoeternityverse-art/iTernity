import { motion } from 'framer-motion';
import { cn } from './ui-utils.js';

/**
 * Card frames one reusable object, tool, or summary without embedding layout assumptions.
 */
export function Card({ children, className = '', interactive = false, error = false }) {
  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    <motion.div
      className={cn(
        'cosmic-hover-card rounded-card border bg-[#0E1310]/88 text-[#F5F7F6] shadow-soft backdrop-blur-xl',
        error ? 'border-red-500/45' : 'border-[rgba(45,232,196,0.15)]',
        'transition duration-200 ease-premium hover:border-[#2DE8C4] hover:shadow-glow',
        className
      )}
      onPointerMove={handlePointerMove}
      whileHover={interactive ? { y: -3 } : undefined}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

/**
 * CardHeader provides consistent spacing for card titles and actions.
 */
export function CardHeader({ title, description, action, className = '' }) {
  return (
    <div className={cn('flex items-start justify-between gap-5 px-6 pb-3 pt-6', className)}>
      <div>
        {title && <h3 className="text-base font-bold tracking-normal text-[#F5F7F6]">{title}</h3>}
        {description && <p className="mt-1.5 text-sm leading-6 text-[#8FA39B]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/**
 * CardContent provides standard inner card spacing.
 */
export function CardContent({ children, className = '' }) {
  return <div className={cn('p-6', className)}>{children}</div>;
}

/**
 * CardFooter provides consistent footer alignment for card actions.
 */
export function CardFooter({ children, className = '' }) {
  return <div className={cn('border-t border-[#F5F7F6]/10 p-6', className)}>{children}</div>;
}

import { motion } from 'framer-motion';
import { cn } from './ui-utils.js';

/**
 * Card frames one reusable object, tool, or summary without embedding layout assumptions.
 */
export function Card({ children, className = '', interactive = false, error = false }) {
  return (
    <motion.div
      className={cn(
        'rounded-card border bg-white text-[#17161D] shadow-soft backdrop-blur-xl',
        error ? 'border-red-500/45' : 'border-[#17161D]/10',
        interactive &&
          'transition duration-200 ease-premium hover:border-[#8969EF]/35 hover:shadow-glow',
        className
      )}
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
        {title && <h3 className="text-base font-bold tracking-normal text-[#17161D]">{title}</h3>}
        {description && <p className="mt-1.5 text-sm leading-6 text-[#6B7280]">{description}</p>}
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
  return <div className={cn('border-t border-[#17161D]/10 p-6', className)}>{children}</div>;
}

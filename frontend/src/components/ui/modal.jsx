import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './button.jsx';
import { cn } from './ui-utils.js';

/**
 * Modal renders an accessible dialog shell controlled by parent state.
 */
export function Modal({
  open,
  title,
  description,
  children,
  footer,
  onClose,
  size = 'md',
  className = '',
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousActiveElement = document.activeElement;
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus?.();
    };
  }, [onClose, open]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#070B14]/75 p-4 py-6 backdrop-blur-md sm:py-8"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16 }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        className={cn(
          'flex max-h-[calc(100vh-3rem)] w-full flex-col overflow-hidden rounded-dialog border border-white/10 bg-[#080808] text-white shadow-glow backdrop-blur-2xl sm:max-h-[calc(100vh-4rem)]',
          sizes[size],
          className
        )}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            {title && (
              <h2 id="modal-title" className="text-xl font-extrabold text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1.5 text-sm leading-6 text-[#8FA39B]">{description}</p>
            )}
          </div>
          {onClose && (
            <Button aria-label="Close modal" variant="icon" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="min-h-0 overflow-y-auto p-6">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-white/10 p-6">{footer}</div>
        )}
      </motion.div>
    </motion.div>
  );
}

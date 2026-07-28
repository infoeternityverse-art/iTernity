import { cloneElement, isValidElement } from 'react';
import { motion } from 'framer-motion';
import { Spinner } from './spinner.jsx';
import { cn, disabledClasses, focusRing, sizeClasses } from './ui-utils.js';

const variants = {
  primary:
    'border border-[#2DE8C4] bg-[#2DE8C4] text-[#060907] shadow-[0_14px_34px_rgba(45,232,196,0.16)] hover:border-[#2DE8C4] hover:bg-transparent hover:text-[#F5F7F6] hover:shadow-[0_18px_44px_rgba(45,232,196,0.22)]',
  secondary:
    'border border-[rgba(45,232,196,0.15)] bg-[#0E1310] text-[#F5F7F6] backdrop-blur hover:border-[#2DE8C4]/70 hover:text-[#2DE8C4]',
  outline:
    'border border-[#2DE8C4] bg-transparent text-[#F5F7F6] hover:border-[#2DE8C4] hover:bg-[#2DE8C4] hover:text-[#060907]',
  ghost: 'text-[#8FA39B] hover:bg-white/[0.05] hover:text-[#F5F7F6]',
  link: 'h-auto px-0 text-[#2DE8C4] underline-offset-4 hover:text-[#F5F7F6] hover:underline',
  success:
    'bg-emerald-500 text-white shadow-[0_10px_34px_rgba(34,197,94,0.22)] hover:bg-emerald-400',
  danger: 'bg-red-500 text-white shadow-[0_10px_34px_rgba(239,68,68,0.22)] hover:bg-red-400',
  icon: 'border border-transparent text-[#8FA39B] hover:border-[rgba(45,232,196,0.15)] hover:bg-[#0E1310] hover:text-[#F5F7F6]',
};

const iconSizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

/**
 * Button is the shared action primitive with visual variants, loading state, and icon support.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  asChild = false,
  type = 'button',
  className = '',
  ...props
}) {
  const isIcon = variant === 'icon';
  const classes = cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-button font-semibold tracking-normal transition duration-200 ease-premium',
    focusRing,
    disabledClasses,
    variants[variant],
    isIcon ? iconSizes[size] : sizeClasses[size],
    className
  );
  const content = (
    <>
      {loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </>
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: cn(classes, children.props.className),
      'aria-disabled': disabled || loading || undefined,
      ...props,
    });
  }

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      className={classes}
      whileHover={disabled || loading ? undefined : { y: -1 }}
      whileTap={disabled || loading ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      {...props}
    >
      {content}
    </motion.button>
  );
}

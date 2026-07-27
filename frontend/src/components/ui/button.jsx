import { cloneElement, isValidElement } from 'react';
import { motion } from 'framer-motion';
import { Spinner } from './spinner.jsx';
import { cn, disabledClasses, focusRing, sizeClasses } from './ui-utils.js';

const variants = {
  primary:
    'border border-[#8969EF]/60 bg-[#8969EF]/18 text-[#17161D] shadow-[0_14px_34px_rgba(137,105,239,0.16)] hover:border-[#8969EF]/80 hover:bg-[#8969EF]/26 hover:text-[#17161D] hover:shadow-[0_18px_44px_rgba(137,105,239,0.22)]',
  secondary:
    'border border-[#17161D]/10 bg-white text-[#17161D] backdrop-blur hover:border-[#8969EF]/40 hover:text-[#8969EF]',
  outline:
    'border border-[#17161D] bg-transparent text-[#17161D] hover:border-[#8969EF] hover:bg-white hover:text-[#8969EF]',
  ghost: 'text-[#6B7280] hover:bg-white hover:text-[#17161D]',
  link: 'h-auto px-0 text-[#8969EF] underline-offset-4 hover:text-[#17161D] hover:underline',
  success:
    'bg-emerald-500 text-white shadow-[0_10px_34px_rgba(34,197,94,0.22)] hover:bg-emerald-400',
  danger: 'bg-red-500 text-white shadow-[0_10px_34px_rgba(239,68,68,0.22)] hover:bg-red-400',
  icon: 'border border-transparent text-[#6B7280] hover:border-[#17161D]/10 hover:bg-white hover:text-[#17161D]',
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

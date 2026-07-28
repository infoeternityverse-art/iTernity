import { NavLink as RouterNavLink } from 'react-router-dom';
import { cn, focusRing } from '@/components/ui/ui-utils.js';

/**
 * NavLink centralizes active and focus styling for layout navigation.
 */
export function NavLink({ item, compact = false, onClick }) {
  const Icon = item.icon;

  return (
    <RouterNavLink
      to={item.href}
      end={item.href === '/' || item.href === '/dashboard' || item.href === '/admin'}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'relative inline-flex items-center gap-2 rounded-button px-3 py-2 text-sm font-semibold transition duration-200 ease-premium after:absolute after:bottom-1 after:left-4 after:right-4 after:h-0.5 after:origin-center after:rounded-full after:bg-[#2DE8C4] after:shadow-[0_0_18px_rgba(45,232,196,0.75)] after:transition after:duration-200 after:ease-premium',
          focusRing,
          isActive
            ? 'bg-[#2DE8C4]/10 text-[#F5F7F6] after:scale-x-100'
            : 'text-[#F5F7F6]/70 after:scale-x-0 hover:bg-white/[0.04] hover:text-[#2DE8C4] hover:after:scale-x-75',
          compact && 'w-full'
        )
      }
    >
      {Icon && <Icon className="h-4 w-4" />}
      {item.label}
    </RouterNavLink>
  );
}

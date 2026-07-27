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
          'relative inline-flex items-center gap-2 rounded-button px-3 py-2 text-sm font-semibold transition duration-200 ease-premium after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:origin-center after:rounded-full after:bg-brand-500 after:shadow-[0_0_18px_rgba(172,126,231,0.75)] after:transition after:duration-200 after:ease-premium',
          focusRing,
          isActive
            ? 'text-[#17161D] after:scale-x-100'
            : 'text-[#17161D]/70 after:scale-x-0 hover:text-[#8969EF] hover:after:scale-x-75',
          compact && 'w-full'
        )
      }
    >
      {Icon && <Icon className="h-4 w-4" />}
      {item.label}
    </RouterNavLink>
  );
}

import { Badge } from './badge.jsx';

const statusVariantMap = {
  active: 'success',
  available: 'success',
  success: 'success',
  pending: 'warning',
  provisioning: 'warning',
  maintenance: 'warning',
  warning: 'warning',
  inactive: 'neutral',
  disabled: 'neutral',
  stopped: 'neutral',
  expired: 'neutral',
  revoked: 'danger',
  rejected: 'danger',
  failed: 'danger',
  error: 'danger',
  running: 'success',
  published: 'success',
  draft: 'neutral',
  scheduled: 'warning',
  archived: 'neutral',
};

/**
 * StatusBadge maps common status values to accessible badge colors.
 */
export function StatusBadge({ status, label, size = 'md', className = '' }) {
  const normalizedStatus = String(status || 'neutral').toLowerCase();
  const variant = statusVariantMap[normalizedStatus] || 'neutral';

  return (
    <Badge variant={variant} size={size} className={className}>
      {label || normalizedStatus}
    </Badge>
  );
}

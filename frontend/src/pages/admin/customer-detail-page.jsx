import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { MailPlus, Trash2 } from 'lucide-react';
import {
  Alert,
  Card,
  CardContent,
  Button,
  ConfirmationDialog,
  PageHeader,
  SectionHeader,
  Skeleton,
  StatusBadge,
  Table,
} from '@/components/ui/index.js';
import { formatDate, getId } from '@/components/admin/admin-utils.js';
import { useAdminCredentials, useAdminEnquiries, useUser } from '@/hooks/index.js';
import { useDeleteUser, useSendPasswordResetLink } from '@/mutations/user.mutations.js';

export function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const customer = useUser(id);
  const enquiries = useAdminEnquiries({ customer: id, limit: 5 });
  const credentials = useAdminCredentials({ customer: id, limit: 5 });
  const sendPasswordResetLink = useSendPasswordResetLink();
  const deleteUser = useDeleteUser({
    onSuccess: () => navigate('/admin/customers', { replace: true }),
  });

  if (customer.isLoading) return <Skeleton className="h-80" />;
  if (customer.error) return <Alert variant="danger">{customer.error.message}</Alert>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.data.name}
        description={customer.data.email}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge
              status={customer.data.isActive ? 'active' : 'inactive'}
              label={customer.data.isActive ? 'Active' : 'Inactive'}
            />
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<MailPlus className="h-4 w-4" />}
              loading={sendPasswordResetLink.isPending}
              onClick={() => sendPasswordResetLink.mutate(id)}
            >
              Send reset link
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="h-4 w-4" />}
              loading={deleteUser.isPending}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete user
            </Button>
          </div>
        }
      />
      <Card>
        <CardContent className="grid gap-4 p-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Role</p>
            <p className="font-medium">{customer.data.role}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Created</p>
            <p className="font-medium">{formatDate(customer.data.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Last Login</p>
            <p className="font-medium">{formatDate(customer.data.lastLoginAt)}</p>
          </div>
        </CardContent>
      </Card>
      <section className="space-y-4">
        <SectionHeader title="Recent Enquiries" />
        <Table
          loading={enquiries.isLoading}
          error={enquiries.error?.message}
          data={enquiries.data?.data || []}
          getRowKey={getId}
          columns={[
            { key: 'contactEmail', header: 'Email' },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <StatusBadge status={row.status} label={row.status} />,
            },
            { key: 'createdAt', header: 'Submitted', render: (row) => formatDate(row.createdAt) },
          ]}
        />
      </section>
      <section className="space-y-4">
        <SectionHeader title="Credentials" />
        <Table
          loading={credentials.isLoading}
          error={credentials.error?.message}
          data={credentials.data?.data || []}
          getRowKey={getId}
          columns={[
            { key: 'host', header: 'Host' },
            { key: 'username', header: 'Username' },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <StatusBadge status={row.status} label={row.status} />,
            },
            { key: 'expiresAt', header: 'Expiry', render: (row) => formatDate(row.expiresAt) },
          ]}
        />
      </section>
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete user"
        description="This permanently removes the customer account. Related enquiries and credentials will remain in the system."
        confirmLabel="Delete user"
        loading={deleteUser.isPending}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          await deleteUser.mutateAsync(id);
          setDeleteDialogOpen(false);
        }}
      />
    </div>
  );
}

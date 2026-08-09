import { Link } from 'react-router-dom';
import { ClipboardList, Search, User, Workflow } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  PageHeader,
  SectionHeader,
  StatCard,
  StatusBadge,
  Table,
} from '@/components/ui/index.js';
import { formatDate, getId } from '@/components/dashboard/dashboard-utils.js';
import { useCustomerEnquiries, useCustomerWorkspace } from '@/hooks/index.js';
import {
  formatWorkspaceProvider,
  formatWorkspaceStatus,
  getWorkspaceDisplayStatus,
  getWorkspacePackageName,
} from '@/components/admin/workspace-utils.js';
import { useAuthStore } from '@/store/auth-store.js';

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const enquiries = useCustomerEnquiries({ limit: 5, sort: 'createdAt', order: 'desc' });
  const workspace = useCustomerWorkspace({ populate: 'package' });
  const recentEnquiries = enquiries.data?.data || [];
  const activeWorkspace = workspace.data;
  const workspaceStatus = activeWorkspace ? getWorkspaceDisplayStatus(activeWorkspace) : null;
  const recentActivity = [
    ...recentEnquiries.map((enquiry) => ({
      id: `enquiry-${getId(enquiry)}`,
      title: 'Enquiry submitted',
      description: enquiry.projectDescription?.slice(0, 72) || 'GPU enquiry',
      date: enquiry.createdAt,
      status: enquiry.status,
    })),
    ...(activeWorkspace
      ? [
          {
            id: `workspace-${getId(activeWorkspace)}`,
            title: 'Workspace updated',
            description: `${activeWorkspace.gpuModel || getWorkspacePackageName(activeWorkspace)} workspace`,
            date: activeWorkspace.updatedAt || activeWorkspace.createdAt,
            status: workspaceStatus,
          },
        ]
      : []),
  ]
    .sort((first, second) => new Date(second.date || 0) - new Date(first.date || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome${user?.name ? `, ${user.name}` : ''}`}
        description="Track enquiries, workspace access, and account activity from your customer portal."
        action={
          <Button asChild>
            <Link to="/dashboard/inventory">Explore GPUs</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Recent Enquiries"
          value={enquiries.data?.meta?.total ?? '-'}
          loading={enquiries.isLoading}
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <StatCard
          label="Workspace"
          value={activeWorkspace ? formatWorkspaceStatus(workspaceStatus) : 'Pending'}
          loading={workspace.isLoading}
          icon={<Workflow className="h-5 w-5" />}
        />
        <StatCard
          label="Account"
          value={user?.isActive ? 'Active' : 'Pending'}
          icon={<User className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-5">
            <SectionHeader
              title="Recent Enquiries"
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard/enquiries">View all</Link>
                </Button>
              }
            />
            <Table
              loading={enquiries.isLoading}
              error={enquiries.error?.message}
              data={recentEnquiries}
              getRowKey={getId}
              columns={[
                {
                  key: 'projectDescription',
                  header: 'Project',
                  render: (row) => row.projectDescription?.slice(0, 48) || '-',
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (row) => (
                    <StatusBadge
                      status={row.status}
                      label={row.status === 'contacted' ? 'in review' : row.status}
                    />
                  ),
                },
                {
                  key: 'createdAt',
                  header: 'Submitted',
                  render: (row) => formatDate(row.createdAt),
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-5">
            <SectionHeader
              title="Workspace Access"
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard/workspace">Open workspace</Link>
                </Button>
              }
            />
            <Table
              loading={workspace.isLoading}
              error={workspace.error?.message}
              data={activeWorkspace ? [activeWorkspace] : []}
              getRowKey={getId}
              columns={[
                { key: 'gpuModel', header: 'GPU', render: (row) => row.gpuModel || '-' },
                {
                  key: 'provider',
                  header: 'Provider',
                  render: (row) => formatWorkspaceProvider(row.provider),
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (row) => {
                    const status = getWorkspaceDisplayStatus(row);
                    return <StatusBadge status={status} label={status} />;
                  },
                },
                {
                  key: 'expiryDate',
                  header: 'Expiry',
                  render: (row) => formatDate(row.expiryDate),
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-4 p-5">
          <SectionHeader
            title="Recent Activity"
            description="Latest enquiry and workspace updates."
          />
          {recentActivity.length ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-950 dark:text-white">{item.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={item.status}
                      label={item.status === 'contacted' ? 'in review' : item.status}
                    />
                    <span className="text-sm text-slate-500">{formatDate(item.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              New enquiry and workspace updates will appear here.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-5">
          <SectionHeader title="Quick Actions" description="Common self-service paths." />
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" leftIcon={<Search className="h-4 w-4" />}>
              <Link to="/dashboard/inventory">Explore GPU packages</Link>
            </Button>
            <Button asChild variant="outline" leftIcon={<ClipboardList className="h-4 w-4" />}>
              <Link to="/dashboard/enquiries">Track enquiries</Link>
            </Button>
            <Button asChild variant="outline" leftIcon={<Workflow className="h-4 w-4" />}>
              <Link to="/dashboard/workspace">Open workspace</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

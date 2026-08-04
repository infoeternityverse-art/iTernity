import { useMemo, useState } from 'react';
import { Eye, MailCheck } from 'lucide-react';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar.jsx';
import { formatDate, getId, parseSortValue } from '@/components/admin/admin-utils.js';
import {
  Button,
  Modal,
  PageHeader,
  Pagination,
  StatusBadge,
  Table,
} from '@/components/ui/index.js';
import { useAdminContactEnquiries, useUpdateAdminContactEnquiry } from '@/hooks/index.js';

const statusOptions = [
  { label: 'Any status', value: '' },
  { label: 'New', value: 'new' },
  { label: 'In review', value: 'in_review' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' },
];

export function ContactEnquiriesPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortValue, setSortValue] = useState('createdAt:desc');
  const params = useMemo(
    () => ({ page, limit: 10, search, status, ...parseSortValue(sortValue) }),
    [page, search, sortValue, status]
  );
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const contactEnquiries = useAdminContactEnquiries(params);
  const updateContactEnquiry = useUpdateAdminContactEnquiry();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Enquiries"
        description="Review general contact form submissions separately from GPU access enquiries."
      />
      <AdminTableToolbar
        search={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={() => {
          setSearch(searchInput);
          setPage(1);
        }}
        onSearchClear={() => {
          setSearchInput('');
          setSearch('');
          setPage(1);
        }}
        sort={sortValue}
        sortOptions={[
          { label: 'Newest', value: 'createdAt:desc' },
          { label: 'Oldest', value: 'createdAt:asc' },
        ]}
        onSortChange={(value) => {
          setSortValue(value);
          setPage(1);
        }}
        filters={[
          {
            id: 'status',
            label: 'Status',
            value: status,
            onChange: (value) => {
              setStatus(value);
              setPage(1);
            },
            options: statusOptions,
          },
        ]}
      />
      <Table
        loading={contactEnquiries.isLoading}
        error={contactEnquiries.error?.message}
        data={contactEnquiries.data?.data || []}
        getRowKey={getId}
        columns={[
          {
            key: 'contactName',
            header: 'Name',
            render: (row) => <span className="block max-w-40 break-words">{row.contactName}</span>,
          },
          {
            key: 'contactEmail',
            header: 'Email',
            render: (row) => <span className="block max-w-64 break-all">{row.contactEmail}</span>,
          },
          {
            key: 'subject',
            header: 'Subject',
            render: (row) => <span className="block max-w-56 break-words">{row.subject}</span>,
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <StatusBadge
                status={row.status}
                label={row.status === 'in_review' ? 'in review' : row.status}
              />
            ),
          },
          { key: 'createdAt', header: 'Submitted', render: (row) => formatDate(row.createdAt) },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Eye className="h-4 w-4" />}
                  onClick={() => setSelectedEnquiry(row)}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<MailCheck className="h-4 w-4" />}
                  loading={updateContactEnquiry.isPending}
                  onClick={() =>
                    updateContactEnquiry.mutate({
                      id: getId(row),
                      payload: { status: row.status === 'resolved' ? 'closed' : 'resolved' },
                    })
                  }
                >
                  {row.status === 'resolved' ? 'Close' : 'Resolve'}
                </Button>
              </div>
            ),
          },
        ]}
      />
      {contactEnquiries.data?.meta?.totalPages > 1 && (
        <Pagination
          page={contactEnquiries.data.meta.page}
          totalPages={contactEnquiries.data.meta.totalPages}
          onPageChange={setPage}
        />
      )}
      <Modal
        open={Boolean(selectedEnquiry)}
        title="Contact Enquiry"
        description={selectedEnquiry?.subject}
        size="lg"
        onClose={() => setSelectedEnquiry(null)}
      >
        {selectedEnquiry && (
          <div className="space-y-5">
            <dl className="grid gap-4 md:grid-cols-2">
              <div>
                <dt className="text-sm text-[#8FA39B]">Name</dt>
                <dd className="break-words font-semibold text-white">
                  {selectedEnquiry.contactName}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-[#8FA39B]">Email</dt>
                <dd className="break-all font-semibold text-white">
                  {selectedEnquiry.contactEmail}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-[#8FA39B]">Phone</dt>
                <dd className="break-words font-semibold text-white">
                  {selectedEnquiry.contactPhone || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-[#8FA39B]">Submitted</dt>
                <dd className="font-semibold text-white">
                  {formatDate(selectedEnquiry.createdAt)}
                </dd>
              </div>
            </dl>
            <div>
              <p className="text-sm text-[#8FA39B]">Message</p>
              <p className="mt-2 whitespace-pre-wrap break-words rounded-card border border-white/10 bg-white/[0.035] p-4 leading-7 text-[#F5F7F6]">
                {selectedEnquiry.message}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

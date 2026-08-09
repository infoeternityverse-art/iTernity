import { useMemo, useState } from 'react';
import { Activity } from 'lucide-react';
import { GpuMarketplaceControls } from '@/components/gpu/gpu-marketplace-controls.jsx';
import { GpuPackageCard } from '@/components/gpu/gpu-package-card.jsx';
import { Alert, EmptyState, PageHeader, Pagination, Skeleton } from '@/components/ui/index.js';
import { useGpuPackages } from '@/hooks/index.js';

const parseSort = (sortValue) => {
  const [sort, order] = sortValue.split(':');
  return { sort, order };
};

export function CustomerInventoryPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('');
  const [sortValue, setSortValue] = useState('createdAt:desc');
  const sortParams = useMemo(() => parseSort(sortValue), [sortValue]);
  const params = useMemo(
    () => ({ page, limit: 9, search, availabilityStatus, ...sortParams }),
    [availabilityStatus, page, search, sortParams]
  );
  const { data, isLoading, isFetching, error } = useGpuPackages(params);
  const packages = data?.data || [];
  const meta = data?.meta;
  const resultCount = meta?.total ?? packages.length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="GPU Packages"
        title="Find your next GPU environment"
        description="Explore available infrastructure, compare configurations, and submit a request without leaving your dashboard."
        action={
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2DE8C4]/20 bg-[#2DE8C4]/10 px-4 py-2 text-sm font-semibold text-[#2DE8C4]">
            <Activity className="h-4 w-4" aria-hidden="true" />
            {isFetching && !isLoading ? 'Refreshing' : `${resultCount} available options`}
          </div>
        }
      />

      <GpuMarketplaceControls
        search={searchInput}
        availabilityStatus={availabilityStatus}
        sortValue={sortValue}
        onSearchChange={setSearchInput}
        onSearchSubmit={() => {
          setPage(1);
          setSearch(searchInput);
        }}
        onSearchClear={() => {
          setSearchInput('');
          setSearch('');
          setPage(1);
        }}
        onAvailabilityChange={(value) => {
          setAvailabilityStatus(value);
          setPage(1);
        }}
        onSortChange={(value) => {
          setSortValue(value);
          setPage(1);
        }}
      />

      {error && <Alert variant="danger">{error.message}</Alert>}
      {isLoading && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading GPU packages">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[31rem] rounded-card" />
          ))}
        </div>
      )}
      {!isLoading && !error && packages.length === 0 && (
        <EmptyState
          title="No GPU packages found"
          description="Try changing your search, availability filter, or sorting."
        />
      )}
      {!isLoading && !error && packages.length > 0 && (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((gpuPackage) => (
              <GpuPackageCard
                key={gpuPackage.id || gpuPackage._id}
                gpuPackage={gpuPackage}
                detailsBasePath="/dashboard/inventory"
              />
            ))}
          </div>
          {meta && meta.totalPages > 1 && (
            <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}

import { useMemo, useState } from 'react';
import { GpuMarketplaceControls } from '@/components/gpu/gpu-marketplace-controls.jsx';
import { GpuPackageCard } from '@/components/gpu/gpu-package-card.jsx';
import { GpuRecommendationAssistant } from '@/components/gpu/gpu-recommendation-assistant.jsx';
import { Alert, EmptyState, Pagination, SectionHeader, Skeleton } from '@/components/ui/index.js';
import { PublicPageHero } from '@/components/common/public-page-hero.jsx';
import { Seo } from '@/components/common/seo.jsx';
import { useGpuPackages } from '@/hooks/index.js';
import { createBreadcrumbSchema } from '@/utils/seo-schema.js';

const parseSort = (sortValue) => {
  const [sort, order] = sortValue.split(':');
  return { sort, order };
};

export function GpusPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('');
  const [sortValue, setSortValue] = useState('createdAt:desc');
  const sortParams = useMemo(() => parseSort(sortValue), [sortValue]);

  const params = useMemo(
    () => ({
      page,
      limit: 9,
      search,
      availabilityStatus,
      ...sortParams,
    }),
    [availabilityStatus, page, search, sortParams]
  );

  const { data, isLoading, isFetching, error } = useGpuPackages(params);
  const packages = data?.data || [];
  const meta = data?.meta;

  const handleSearchSubmit = () => {
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <div className="space-y-8">
      <Seo
        title="GPU Marketplace"
        description="Compare available cloud GPU rental packages by GPU model, VRAM, CPU, RAM, storage, region, availability, and price."
        path="/gpus"
        structuredData={[
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'GPU Marketplace', path: '/gpus' },
          ]),
        ]}
      />
      <PublicPageHero
        eyebrow="GPU Marketplace"
        title="GPU Marketplace"
        description="Search and compare GPU rental packages by specs, availability, and price."
        variant="market"
      />
      <GpuRecommendationAssistant />
      <GpuMarketplaceControls
        search={searchInput}
        availabilityStatus={availabilityStatus}
        sortValue={sortValue}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
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
      <section className="space-y-4">
        <SectionHeader
          title="Available Packages"
          description={
            isFetching && !isLoading ? 'Refreshing results...' : 'Browse current GPU listings.'
          }
        />
        {error && <Alert variant="danger">{error.message}</Alert>}
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-80" />
            ))}
          </div>
        )}
        {!isLoading && !error && packages.length === 0 && (
          <EmptyState
            title="No GPU packages found"
            description="Try changing your search, filters, or sort options."
          />
        )}
        {!isLoading && !error && packages.length > 0 && (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {packages.map((gpuPackage) => (
                <GpuPackageCard key={gpuPackage.id || gpuPackage._id} gpuPackage={gpuPackage} />
              ))}
            </div>
            {meta && meta.totalPages > 1 && (
              <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
            )}
          </>
        )}
      </section>
    </div>
  );
}

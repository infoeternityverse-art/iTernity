import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Activity, ArrowDownRight } from 'lucide-react';
import { GpuMarketplaceControls } from '@/components/gpu/gpu-marketplace-controls.jsx';
import { GpuObservatoryHero } from '@/components/gpu/gpu-observatory-hero.jsx';
import { GpuPackageCard } from '@/components/gpu/gpu-package-card.jsx';
import { GpuRecommendationAssistant } from '@/components/gpu/gpu-recommendation-assistant.jsx';
import { Alert, EmptyState, Pagination, Skeleton } from '@/components/ui/index.js';
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
  const reduceMotion = useReducedMotion();
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
  const resultLabel = isFetching && !isLoading
    ? 'Refreshing the observatory'
    : `${meta?.total ?? packages.length} configuration${(meta?.total ?? packages.length) === 1 ? '' : 's'} mapped`;

  const handleSearchSubmit = () => {
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <div className="gpu-observatory-page">
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

      <GpuObservatoryHero />

      <section id="gpu-inventory" className="gpu-inventory" aria-labelledby="gpu-inventory-title">
        <motion.header
          className="gpu-inventory-header"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="gpu-section-kicker">Current infrastructure</p>
            <h2 id="gpu-inventory-title">Choose with context, not guesswork.</h2>
          </div>
          <div className="gpu-inventory-signal" role="status" aria-live="polite">
            <Activity />
            <span>{resultLabel}</span>
          </div>
        </motion.header>

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

        {error && <Alert variant="danger">{error.message}</Alert>}
        {isLoading && (
          <div className="gpu-inventory-grid" aria-label="Loading GPU packages">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-[31rem] rounded-none" />
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
            <div className="gpu-inventory-grid">
              {packages.map((gpuPackage, index) => (
                <motion.div
                  key={gpuPackage.id || gpuPackage._id}
                  initial={reduceMotion ? false : { opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{
                    duration: 0.62,
                    delay: reduceMotion ? 0 : (index % 3) * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <GpuPackageCard gpuPackage={gpuPackage} />
                </motion.div>
              ))}
            </div>
            {meta && meta.totalPages > 1 && (
              <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
            )}
          </>
        )}
      </section>

      <section id="gpu-match" className="gpu-match" aria-labelledby="gpu-match-title">
        <motion.div
          className="gpu-match-heading"
          initial={reduceMotion ? false : { opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="gpu-section-kicker">Guided matching</p>
            <h2 id="gpu-match-title">Start with the work. We&apos;ll narrow the hardware.</h2>
          </div>
          <ArrowDownRight aria-hidden="true" />
        </motion.div>
        <GpuRecommendationAssistant />
      </section>
    </div>
  );
}

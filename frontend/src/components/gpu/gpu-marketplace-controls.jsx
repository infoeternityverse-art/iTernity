import { SearchBar, Select } from '@/components/ui/index.js';

const sortOptions = [
  { label: 'Newest', value: 'createdAt:desc' },
  { label: 'Price low to high', value: 'hourlyPrice:asc' },
  { label: 'Price high to low', value: 'hourlyPrice:desc' },
  { label: 'VRAM high to low', value: 'gpuMemoryGb:desc' },
];

const availabilityOptions = [
  { label: 'Any availability', value: '' },
  { label: 'Available', value: 'available' },
  { label: 'Limited', value: 'limited' },
  { label: 'Coming soon', value: 'coming_soon' },
];

export function GpuMarketplaceControls({
  search,
  availabilityStatus,
  sortValue,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  onAvailabilityChange,
  onSortChange,
}) {
  return (
    <div className="grid items-end gap-4 rounded-[20px] border border-[rgba(45,232,196,0.15)] bg-[#0E1310]/88 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
      <SearchBar
        value={search}
        onChange={onSearchChange}
        onSubmit={onSearchSubmit}
        onClear={onSearchClear}
        placeholder="Search GPU model, region, or use case"
      />
      <Select
        id="availability"
        label="Availability"
        value={availabilityStatus}
        onChange={(event) => onAvailabilityChange(event.target.value)}
        options={availabilityOptions}
      />
      <Select
        id="sort"
        label="Sort"
        value={sortValue}
        onChange={(event) => onSortChange(event.target.value)}
        options={sortOptions}
      />
    </div>
  );
}

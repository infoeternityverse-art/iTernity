import { ChevronDown, ChevronUp } from 'lucide-react';
import { Spinner } from './spinner.jsx';
import { cn } from './ui-utils.js';

/**
 * Table renders accessible tabular data with loading, empty, error, and sortable header states.
 */
export function Table({
  columns = [],
  data = [],
  getRowKey = (_, index) => index,
  loading = false,
  error,
  emptyMessage = 'No records found.',
  sort,
  onSortChange,
  className = '',
}) {
  const renderSortIcon = (column) => {
    if (!column.sortable || sort?.field !== column.key) return null;
    return sort?.order === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5" />
    );
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-table border border-white/10 bg-[#080808] shadow-soft backdrop-blur-xl',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="sticky top-0 z-10 bg-white/[0.055] backdrop-blur-xl">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.08em] text-[#8FA39B]"
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 transition hover:text-white"
                      onClick={() => onSortChange?.(column.key)}
                    >
                      {column.header}
                      {renderSortIcon(column)}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-[#8FA39B]">
                  <span className="inline-flex items-center gap-2">
                    <Spinner size="sm" /> Loading
                  </span>
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-red-300">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-[#8FA39B]">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              data.map((row, rowIndex) => (
                <tr
                  key={getRowKey(row, rowIndex)}
                  className="transition duration-150 ease-premium hover:bg-white/[0.045]"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-5 py-4 text-[#F5F7F6]">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

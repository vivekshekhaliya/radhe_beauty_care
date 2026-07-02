import React from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | string | ((row: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: string;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;

  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;

  // Selection (Bulk Actions)
  selectedIds?: number[];
  onSelectRow?: (id: number) => void;
  onSelectAll?: (checked: boolean) => void;
  rowIdAccessor?: (row: T) => number;

  // Pagination
  currentPage?: number;
  lastPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;

  emptyMessage?: string;
}

function Table<T>({
  columns,
  data,
  isLoading = false,
  sortBy,
  sortOrder,
  onSort,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  rowIdAccessor,
  currentPage = 1,
  lastPage = 1,
  total = 0,
  onPageChange,
  emptyMessage = 'No records found.',
}: TableProps<T>) {

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelectAll) {
      onSelectAll(e.target.checked);
    }
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  return (
    <div className="w-full flex flex-col">
      {/* Scrollable Table Wrapper */}
      <div className="overflow-x-auto w-full border border-white/5 rounded-2xl bg-[#111111]/45 backdrop-blur-md">
        <table className="min-w-full divide-y divide-white/5 text-left border-collapse">
          {/* Header */}
          <thead className="bg-[#151515] text-[10px] font-sans font-extrabold uppercase tracking-widest text-primary">
            <tr>
              {/* Checkbox Header */}
              {onSelectAll && (
                <th scope="col" className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = isSomeSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 accent-primary border-white/20 bg-dark rounded focus:ring-primary cursor-pointer"
                  />
                </th>
              )}

              {columns.map((col, index) => {
                const isCurrentSort = sortBy && col.sortKey === sortBy;
                return (
                  <th
                    key={index}
                    scope="col"
                    className={`px-6 py-4 font-extrabold text-xs select-none ${col.className || ''}`}
                  >
                    {col.sortable && onSort && col.sortKey ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.sortKey!)}
                        className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                      >
                        <span>{col.header}</span>
                        {isCurrentSort ? (
                          sortOrder === 'asc' ? (
                            <ChevronUp className="w-4.5 h-4.5 text-primary" />
                          ) : (
                            <ChevronDown className="w-4.5 h-4.5 text-primary" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-muted/65" />
                        )}
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-white/5 font-sans text-sm text-white/85">
            {isLoading ? (
              // Loading Skeleton State
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {onSelectAll && (
                    <td className="px-6 py-4.5 text-center">
                      <div className="w-4 h-4 bg-white/10 rounded mx-auto" />
                    </td>
                  )}
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-6 py-4.5">
                      <div className="h-4 bg-white/10 rounded w-4/5" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length + (onSelectAll ? 1 : 0)}
                  className="px-6 py-12 text-center text-muted font-sans font-light"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Actual Data
              data.map((row, rIdx) => {
                const rowId = rowIdAccessor ? rowIdAccessor(row) : (row as any).id;
                const isSelected = selectedIds.includes(rowId);

                return (
                  <tr
                    key={rIdx}
                    className={`hover:bg-white/[0.02] transition-colors ${isSelected ? 'bg-primary/5 hover:bg-primary/10' : ''
                      }`}
                  >
                    {/* Checkbox Cell */}
                    {onSelectRow && (
                      <td className="px-6 py-4 w-12 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectRow(rowId)}
                          className="w-4 h-4 accent-primary border-white/20 bg-dark rounded focus:ring-primary cursor-pointer"
                        />
                      </td>
                    )}

                    {columns.map((col, cIdx) => {
                      let content: React.ReactNode;
                      if (typeof col.accessor === 'function') {
                        content = col.accessor(row);
                      } else {
                        content = (row as any)[col.accessor] as React.ReactNode;
                      }

                      return (
                        <td
                          key={cIdx}
                          className={`px-6 py-4 align-middle font-light ${col.className || ''}`}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && data.length > 0 && onPageChange && lastPage > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-4">
          {/* Total Text */}
          <div className="text-xs text-muted font-sans font-semibold">
            Showing Page <span className="text-primary">{currentPage}</span> of <span className="text-white">{lastPage}</span> ({total} total records)
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#111111] hover:bg-[#151515] border border-white/5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: lastPage }).map((_, idx) => {
                const pageNum = idx + 1;
                // Simple pager window logic: show first, last, and window around current
                if (
                  pageNum === 1 ||
                  pageNum === lastPage ||
                  Math.abs(pageNum - currentPage) <= 1
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-sans font-bold flex items-center justify-center cursor-pointer transition-colors ${currentPage === pageNum
                          ? 'bg-primary text-black font-extrabold shadow-md'
                          : 'bg-transparent border border-white/5 text-muted hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === 2 && currentPage > 3) ||
                  (pageNum === lastPage - 1 && currentPage < lastPage - 2)
                ) {
                  return (
                    <span key={pageNum} className="text-muted text-xs align-bottom px-1 select-none">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="px-4 py-2 bg-[#111111] hover:bg-[#151515] border border-white/5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;

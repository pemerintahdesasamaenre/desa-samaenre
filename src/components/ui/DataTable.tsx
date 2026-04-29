'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  headerClassName?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  renderExpandedRow?: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyState?: React.ReactNode;
  isLoading?: boolean | undefined;
  loadingState?: React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  renderExpandedRow,
  keyExtractor,
  onRowClick,
  emptyState,
  isLoading,
  loadingState,
}: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };

  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden shadow-sm w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {renderExpandedRow && (
                <th className="md:hidden w-10 px-3 py-4"></th>
              )}
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={`px-4 sm:px-6 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider ${
                    column.hideOnMobile ? 'hidden md:table-cell' : ''
                  } ${column.hideOnTablet ? 'hidden lg:table-cell' : ''} ${getAlignmentClass(
                    column.align
                  )} ${column.headerClassName || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (renderExpandedRow ? 1 : 0)} className="px-6 py-20 text-center">
                  {loadingState || (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Memuat data...</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (renderExpandedRow ? 1 : 0)} className="px-6 py-20 text-center">
                  {emptyState || (
                    <p className="text-sm font-medium text-muted-foreground italic">Data tidak ditemukan.</p>
                  )}
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const id = keyExtractor(item);
                const isExpanded = expandedRows.includes(id);

                return (
                  <React.Fragment key={id}>
                    <tr
                      className={`hover:bg-primary/5 transition-colors group ${
                        onRowClick || renderExpandedRow ? 'cursor-pointer' : ''
                      }`}
                      onClick={() => {
                        if (onRowClick) onRowClick(item);
                        if (renderExpandedRow && window.innerWidth < 768) toggleRow(id);
                      }}
                    >
                      {renderExpandedRow && (
                        <td className="md:hidden px-3 py-4 text-center">
                          <button
                            onClick={(e) => toggleRow(id, e)}
                            className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                      )}
                      {columns.map((column, colIdx) => (
                        <td
                          key={colIdx}
                          className={`px-4 sm:px-6 py-4 ${
                            column.hideOnMobile ? 'hidden md:table-cell' : ''
                          } ${column.hideOnTablet ? 'hidden lg:table-cell' : ''} ${getAlignmentClass(
                            column.align
                          )} ${column.className || ''}`}
                        >
                          {typeof column.accessor === 'function'
                            ? column.accessor(item)
                            : column.accessor
                            ? (item[column.accessor] as React.ReactNode)
                            : null}
                        </td>
                      ))}
                    </tr>
                    {renderExpandedRow && isExpanded && (
                      <tr className="md:hidden bg-muted/5 animate-in slide-in-from-top-1 duration-200">
                        <td
                          colSpan={columns.length + 1}
                          className="px-4 py-5 border-l-4 border-primary"
                        >
                          {renderExpandedRow(item)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResidentPaginationProps {
  page: number;
  total: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export const ResidentPagination = ({
  page,
  total,
  totalPages,
  onPageChange
}: ResidentPaginationProps) => {
  return (
    <div className="px-4 py-3 bg-muted/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
        Total <span className="text-foreground">{total}</span> Penduduk
      </div>
      
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="h-8 w-8 rounded-lg border border-border bg-card text-muted-foreground disabled:opacity-30 flex items-center justify-center"
        >
          <ChevronLeft size={14} />
        </button>
        
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-black px-2 py-1 bg-primary text-primary-foreground rounded-md shadow-sm">
            {page}
          </span>
          <span className="text-[10px] font-bold text-muted-foreground">/</span>
          <span className="text-[10px] font-bold text-muted-foreground">{totalPages}</span>
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="h-8 w-8 rounded-lg border border-border bg-card text-muted-foreground disabled:opacity-30 flex items-center justify-center"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { getResidents, getDusuns, deleteResident, logSensitiveView, type ResidentDisplayData } from '@/actions/residents';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { ResidentTableHeader } from './table/ResidentTableHeader';
import { ResidentTableRow } from './table/ResidentTableRow';
import { ResidentPagination } from './table/ResidentPagination';

export default function ResidentTable() {
  const [data, setData] = useState<ResidentDisplayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dusun, setDusun] = useState('SEMUA');
  const [dusuns, setDusuns] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [visibleIds, setVisibleIds] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, name: string } | null>(null);

  const maskString = (str: string) => {
    if (!str) return '';
    if (str.length <= 6) return '******';
    return `${str.slice(0, 6)}**********`;
  };

  const toggleVisibility = async (id: string, name: string) => {
    const isBecomingVisible = !visibleIds.includes(id);
    if (isBecomingVisible) {
      logSensitiveView(id, name).catch(console.error);
    }
    setVisibleIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); 
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await getResidents({
      page,
      limit,
      search: debouncedSearch,
      dusun
    });
    setData(result.data);
    setTotal(result.total);
    setLoading(false);
  }, [page, limit, debouncedSearch, dusun]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  useEffect(() => {
    async function loadDusuns() {
      const list = await getDusuns();
      setDusuns(list);
    }
    loadDusuns();
  }, []);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(deleteConfirm.id);
    const result = await deleteResident(deleteConfirm.id);
    if (result.success) {
      setDeleteConfirm(null);
      fetchData();
    } else {
      alert('Gagal menghapus: ' + result.error);
    }
    setIsDeleting(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <ResidentTableHeader 
        search={search}
        onSearchChange={setSearch}
        dusun={dusun}
        onDusunChange={(val) => { setDusun(val); setPage(1); }}
        dusuns={dusuns}
      />

      <div className="bg-card rounded-2xl sm:rounded-[2.5rem] border border-border shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {/* Kolom 1: Toggle (Hanya Mobile) */}
                <th className="md:hidden w-10 px-3 py-4"></th>
                
                {/* Kolom 2: Nama/Konten Utama */}
                <th className="px-4 sm:px-8 py-4 text-[9px] sm:text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Penduduk</th>
                
                {/* Kolom Desktop Only */}
                <th className="hidden md:table-cell px-8 py-4 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] w-1/3">Identitas</th>
                <th className="hidden lg:table-cell px-8 py-4 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] w-1/4">Wilayah</th>
                
                {/* Kolom Aksi (Desktop Only) */}
                <th className="hidden md:table-cell px-8 py-4 text-[9px] sm:text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] text-right w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary mb-3" size={24} />
                    <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Memuat...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground font-medium italic text-sm">
                    Data kosong.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <ResidentTableRow 
                    key={item.id}
                    item={item}
                    isVisible={visibleIds.includes(item.id)}
                    isExpanded={expandedRows.includes(item.id)}
                    isDeleting={isDeleting === item.id}
                    onToggleVisibility={() => toggleVisibility(item.id, item.name)}
                    onToggleExpand={() => toggleRow(item.id)}
                    onDelete={() => setDeleteConfirm({ id: item.id, name: item.name })}
                    maskString={maskString}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && total > 0 && (
          <ResidentPagination 
            page={page}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      <ConfirmDialog 
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Hapus Data"
        description={`Hapus penduduk "${deleteConfirm?.name}"?`}
        variant="danger"
        requirePhrase={deleteConfirm?.name}
        confirmLabel="Hapus"
        loading={!!isDeleting}
      />
    </div>
  );
}

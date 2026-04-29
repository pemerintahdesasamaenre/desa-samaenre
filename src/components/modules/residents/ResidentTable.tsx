'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Eye, EyeOff, ShieldAlert, Edit2 } from 'lucide-react';
import { getResidents, getDusuns, deleteResident, logSensitiveView, type ResidentDisplayData } from '@/actions/residents';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { ResidentTableHeader } from './table/ResidentTableHeader';
import { ResidentPagination } from './table/ResidentPagination';
import { toast } from 'sonner';
import { DataTable, Column } from '@/components/ui/DataTable';
import Link from 'next/link';

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
  
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, name: string } | null>(null);

  const maskString = (str: string) => {
    if (!str) return '';
    if (str.length <= 6) return '******';
    return `${str.slice(0, 6)}**********`;
  };

  const toggleVisibility = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isBecomingVisible = !visibleIds.includes(id);
    if (isBecomingVisible) {
      logSensitiveView(id, name).catch(console.error);
    }
    setVisibleIds(prev => 
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, dusun]);

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
    const toastId = toast.loading(`Menghapus data "${deleteConfirm.name}"...`);
    const result = await deleteResident(deleteConfirm.id);
    if (result.success) {
      toast.success(`Data "${deleteConfirm.name}" berhasil dihapus`, { id: toastId });
      setDeleteConfirm(null);
      fetchData();
    } else {
      toast.error('Gagal menghapus: ' + result.error, { id: toastId });
    }
    setIsDeleting(null);
  };

  const totalPages = Math.ceil(total / limit);

  const columns: Column<ResidentDisplayData>[] = [
    {
      header: 'Penduduk',
      accessor: (item) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-foreground text-sm sm:text-base tracking-tight leading-tight">
            {item.name}
          </span>
          <span className="md:hidden text-[8px] text-muted-foreground mt-1 font-bold uppercase tracking-widest truncate">
            NIK: {visibleIds.includes(item.id) ? item.nik : maskString(item.nik)}
          </span>
        </div>
      ),
    },
    {
      header: 'Identitas',
      hideOnMobile: true,
      accessor: (item) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase w-8">NIK</span>
            <code className="text-[11px] font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">
              {visibleIds.includes(item.id) ? item.nik : maskString(item.nik)}
            </code>
            <button 
              onClick={(e) => toggleVisibility(item.id, item.name, e)}
              className="p-1 text-muted-foreground hover:text-primary transition-colors"
            >
              {visibleIds.includes(item.id) ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase w-8">KK</span>
            <code className="text-[11px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {visibleIds.includes(item.id) ? item.kk : maskString(item.kk)}
            </code>
          </div>
        </div>
      ),
    },
    {
      header: 'Wilayah',
      hideOnMobile: true,
      hideOnTablet: true,
      accessor: (item) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">{item.dusun}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase">RT {item.rt} / RW {item.rw}</span>
        </div>
      ),
    },
    {
      header: 'Aksi',
      align: 'right',
      accessor: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Link 
            href={`/admin/residents/edit/${item.id}`}
            className="p-2 text-muted-foreground hover:text-primary bg-muted/50 rounded-lg transition-all"
          >
            <Edit2 size={14} />
          </Link>
          <button 
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ id: item.id, name: item.name }); }}
            className="p-2 text-muted-foreground hover:text-destructive bg-muted/50 rounded-lg transition-all"
          >
            <ShieldAlert size={14} />
          </button>
        </div>
      ),
    },
  ];

  const renderExpandedRow = (item: ResidentDisplayData) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 bg-background/50 p-4 rounded-2xl border border-border/50">
        <div className="space-y-1">
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Identitas (Terproteksi)</p>
          <div className="flex items-center gap-2 mt-1">
            <code className="text-[10px] font-mono font-bold text-primary">
              {visibleIds.includes(item.id) ? item.nik : maskString(item.nik)}
            </code>
            <button 
              onClick={(e) => toggleVisibility(item.id, item.name, e)}
              className="p-1 text-muted-foreground"
            >
              {visibleIds.includes(item.id) ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Wilayah / Dusun</p>
          <p className="text-[10px] font-bold text-foreground uppercase mt-1">{item.dusun} (RT {item.rt})</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Opsi Pengelolaan</p>
        <div className="grid grid-cols-2 gap-2">
          <Link 
            href={`/admin/residents/edit/${item.id}`}
            className="flex items-center justify-center gap-2 bg-background border border-border text-foreground py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest active:scale-95"
          >
            <Edit2 size={14} className="text-primary" />
            Edit Data
          </Link>
          <button 
            onClick={() => setDeleteConfirm({ id: item.id, name: item.name })}
            className="flex items-center justify-center gap-2 bg-destructive/5 border border-destructive/20 text-destructive py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest active:scale-95"
          >
            <ShieldAlert size={14} />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <ResidentTableHeader 
        search={search}
        onSearchChange={setSearch}
        dusun={dusun}
        onDusunChange={(val) => { setDusun(val); setPage(1); }}
        dusuns={dusuns}
      />

      <DataTable
        data={data}
        columns={columns}
        keyExtractor={(item) => item.id}
        renderExpandedRow={renderExpandedRow}
        isLoading={loading}
        loadingState={
          <div className="py-20 text-center">
            <Loader2 className="animate-spin mx-auto text-primary mb-3" size={24} />
            <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Memuat Data Penduduk...</p>
          </div>
        }
        emptyState={
          <div className="py-20 text-center text-muted-foreground font-medium italic text-sm">
            Data penduduk tidak ditemukan.
          </div>
        }
      />

      {!loading && total > 0 && (
        <ResidentPagination 
          page={page}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

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

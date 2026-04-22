'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, ChevronLeft, ChevronRight, Trash2, Edit, Loader2, UserPlus, FileSpreadsheet, Eye, EyeOff } from 'lucide-react';
import { getResidents, getDusuns, deleteResident, logSensitiveView, type ResidentDisplayData } from '@/actions/residents';
import Link from 'next/link';
import CustomSelect from '@/components/ui/CustomSelect';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

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
  
  // State untuk konfirmasi hapus
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, name: string } | null>(null);

  // Format dusuns for CustomSelect
  const dusunOptions = [
    { id: 'SEMUA', name: 'Semua Dusun' },
    ...dusuns.map(d => ({ id: d, name: d }))
  ];

  // Helper to mask sensitive data
  const maskString = (str: string) => {
    if (!str) return '';
    if (str.length <= 6) return '******';
    return `${str.slice(0, 6)}**********`;
  };

  const toggleVisibility = async (id: string, name: string) => {
    const isBecomingVisible = !visibleIds.includes(id);
    
    if (isBecomingVisible) {
      // Log akses data sensitif ke database audit (Non-blocking)
      logSensitiveView(id, name).catch(console.error);
    }

    setVisibleIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search
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
    fetchData();
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
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Cari NIK, KK, atau Nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm h-14 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-64">
            <CustomSelect 
              options={dusunOptions}
              value={dusun}
              onChange={(val) => { setDusun(val); setPage(1); }}
              icon={MapPin}
              placeholder="Filter Dusun"
            />
          </div>

          <Link
            href="/admin/statistics/import"
            className="flex items-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-full transition-all hover:bg-muted font-bold shadow-sm h-14"
          >
            <FileSpreadsheet size={18} />
            <span className="hidden sm:inline">Import</span>
          </Link>

          <Link
            href="/admin/residents/new"
            className="flex items-center gap-2 bg-primary hover:opacity-90 text-primary-foreground px-8 py-3 rounded-full transition-all shadow-xl shadow-primary/20 font-black h-14 uppercase text-xs tracking-widest"
          >
            <UserPlus size={18} />
            <span className="hidden sm:inline">Tambah Penduduk</span>
          </Link>
        </div>
      </div>

      {/* Tabs Filter Dusun (Alternative View) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <button
          onClick={() => { setDusun('SEMUA'); setPage(1); }}
          className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            dusun === 'SEMUA' 
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
            : 'bg-card text-muted-foreground border border-border hover:border-primary/50'
          }`}
        >
          Semua Wilayah
        </button>
        {dusuns.map((d) => (
          <button
            key={d}
            onClick={() => { setDusun(d); setPage(1); }}
            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              dusun === d 
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
              : 'bg-card text-muted-foreground border border-border hover:border-primary/50'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-8 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Penduduk</th>
                <th className="px-8 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Identitas</th>
                <th className="px-8 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Wilayah</th>
                <th className="px-8 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary mb-4" size={32} />
                    <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Memuat data...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center text-muted-foreground font-medium italic">
                    Tidak ada data penduduk yang ditemukan.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="font-black text-foreground group-hover:text-primary transition-colors tracking-tight text-base">
                        {item.name}
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                        {item.gender === 'L' ? 'Laki-laki' : 'Perempuan'} • {item.occupation}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <div className="text-sm font-mono font-bold text-foreground/80 tracking-widest">
                            {visibleIds.includes(item.id) ? item.nik : maskString(item.nik)}
                          </div>
                          <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                            KK: {visibleIds.includes(item.id) ? item.kk : maskString(item.kk)}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleVisibility(item.id, item.name)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                          title={visibleIds.includes(item.id) ? 'Sembunyikan' : 'Tampilkan'}
                        >
                          {visibleIds.includes(item.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-black text-foreground/80 tracking-tight">
                        {item.dusun}
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                        RT {item.rt} / RW {item.rw}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/residents/edit/${item.id}`}
                          className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-2xl transition-all border border-transparent hover:border-primary/20"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm({ id: item.id, name: item.name })}
                          disabled={isDeleting === item.id}
                          className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all border border-transparent hover:border-destructive/20"
                          title="Hapus"
                        >
                          {isDeleting === item.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="px-8 py-5 bg-muted/30 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Menampilkan <span className="text-foreground">{(page - 1) * limit + 1}</span> - <span className="text-foreground">{Math.min(page * limit, total)}</span> dari <span className="text-foreground">{total}</span> penduduk
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-3 rounded-2xl border border-border bg-card text-muted-foreground disabled:opacity-30 hover:bg-muted transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-2">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum = page;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-11 h-11 rounded-2xl text-sm font-black transition-all ${
                        page === pageNum
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'bg-card text-muted-foreground hover:bg-muted border border-border'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-3 rounded-2xl border border-border bg-card text-muted-foreground disabled:opacity-30 hover:bg-muted transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL KONFIRMASI HAPUS (DENGAN PHRASE UNTUK KEAMANAN) */}
      <ConfirmDialog 
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Hapus Data Penduduk"
        description={`Apakah Anda benar-benar yakin ingin menghapus data penduduk atas nama "${deleteConfirm?.name}"? Tindakan ini akan menghilangkan record secara permanen.`}
        variant="danger"
        requirePhrase={deleteConfirm?.name}
        confirmLabel="Hapus Permanen"
        loading={!!isDeleting}
      />
    </div>
  );
}

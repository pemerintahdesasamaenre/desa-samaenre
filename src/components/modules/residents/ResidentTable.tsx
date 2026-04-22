'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, ChevronLeft, ChevronRight, Trash2, Edit, Loader2, UserPlus, FileSpreadsheet, Eye, EyeOff } from 'lucide-react';
import { getResidents, getDusuns, deleteResident, logSensitiveView, type ResidentDisplayData } from '@/actions/residents';
import Link from 'next/link';
import CustomSelect from '@/components/ui/CustomSelect';

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
      // Log akses data sensitif ke database audit
      await logSensitiveView(id, name);
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

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data "${name}"?`)) {
      setIsDeleting(id);
      const result = await deleteResident(id);
      if (result.success) {
        fetchData();
      } else {
        alert('Gagal menghapus: ' + result.error);
      }
      setIsDeleting(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari NIK, KK, atau Nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
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
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-5 py-3.5 rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-700 font-bold shadow-sm"
          >
            <FileSpreadsheet size={18} />
            <span className="hidden sm:inline">Import</span>
          </Link>

          <Link
            href="/admin/residents/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-900/20 font-bold"
          >
            <UserPlus size={18} />
            <span className="hidden sm:inline">Tambah Penduduk</span>
          </Link>
        </div>
      </div>

      {/* Tabs Filter Dusun (Alternative View) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => { setDusun('SEMUA'); setPage(1); }}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
            dusun === 'SEMUA' 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-300'
          }`}
        >
          Semua Wilayah
        </button>
        {dusuns.map((d) => (
          <button
            key={d}
            onClick={() => { setDusun(d); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              dusun === d 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-300'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Penduduk</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Identitas</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Wilayah</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-600 mb-2" size={32} />
                    <p className="text-slate-500 font-medium">Memuat data penduduk...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-500">
                    Tidak ada data penduduk yang ditemukan.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {item.gender === 'L' ? 'Laki-laki' : 'Perempuan'} • {item.occupation}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="space-y-0.5">
                          <div className="text-sm font-mono text-slate-700 dark:text-slate-300">
                            NIK: {visibleIds.includes(item.id) ? item.nik : maskString(item.nik)}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            KK: {visibleIds.includes(item.id) ? item.kk : maskString(item.kk)}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleVisibility(item.id, item.name)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                          title={visibleIds.includes(item.id) ? 'Sembunyikan' : 'Tampilkan'}
                        >
                          {visibleIds.includes(item.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {item.dusun}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        RT {item.rt} / RW {item.rw}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/residents/edit/${item.id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          disabled={isDeleting === item.id}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
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
          <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-bold text-slate-900 dark:text-white">{(page - 1) * limit + 1}</span> - <span className="font-bold text-slate-900 dark:text-white">{Math.min(page * limit, total)}</span> dari <span className="font-bold text-slate-900 dark:text-white">{total}</span> penduduk
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1">
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
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        page === pageNum
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 border border-slate-200 dark:border-slate-700'
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
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

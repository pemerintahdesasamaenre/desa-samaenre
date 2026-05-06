'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, FileSpreadsheet, Upload, Loader2, BarChart, Trash2, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { importResidents } from '@/actions/residents';
import { type ResidentInput } from '@/lib/validations';

export default function StatisticsImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [sheets, setSheets] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentYear = new Date().getFullYear();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) prepareFile(selected);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) prepareFile(dropped);
  };

  const prepareFile = async (selected: File) => {
    setFile(selected);
    setLogs(['File "' + selected.name + '" berhasil dimuat.', 'Mendeteksi struktur data...']);
    
    try {
      const data = await selected.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      const validSheets = workbook.SheetNames.filter(name => {
        const n = name.toUpperCase().trim();
        const isSummary = n.includes('T.U.') || n.includes('K.U.') || n.includes('KESIMPULAN');
        return !isSummary;
      });
      
      setSheets(validSheets);
      const excludedCount = workbook.SheetNames.length - validSheets.length;
      
      setLogs(prev => [
        ...prev, 
        `Total: ${workbook.SheetNames.length} sheet terdeteksi.`,
        `Filter: Mengabaikan ${excludedCount} sheet ringkasan/statistik.`,
        `Target: Siap memproses ${validSheets.length} sheet dusun: [${validSheets.join(', ')}].`
      ]);
    } catch {
      setLogs(prev => [...prev, 'ERROR: Gagal membaca file Excel.']);
    }
  };

  const reset = () => {
    setFile(null);
    setSheets([]);
    setLogs([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file || sheets.length === 0) return;
    setLoading(true);
    setLogs(prev => [...prev, 'Memulai proses impor massal...', 'Menganalisis struktur kolom perdusun...']);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      let allFormattedData: ResidentInput[] = [];

      for (const sheetName of sheets) {
        const worksheet = workbook.Sheets[sheetName];
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as unknown[][];
        
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(rawRows.length, 15); i++) {
          const row = rawRows[i];
          if (row.some(cell => {
            const c = String(cell).toUpperCase().trim();
            return c === 'NIK' || c === 'NAMA' || c.includes('KARTU KELUARGA');
          })) {
            headerRowIndex = i;
            break;
          }
        }

        if (headerRowIndex === -1) {
          setLogs(prev => [...prev, `WARNING: Sheet ${sheetName} diabaikan (header tidak ditemukan).`]);
          continue;
        }

        const headers = rawRows[headerRowIndex].map(h => String(h || '').trim().toUpperCase());
        const dataRows = rawRows.slice(headerRowIndex + 1);
        
        // Logika Forward Fill untuk KK
        let lastValidKK = '';
        
        const sheetProcessedData = dataRows.map((row): ResidentInput | null => {
          const getIdx = (targets: string[], exact = false) => {
            return headers.findIndex(h => {
              if (exact) return targets.includes(h);
              return targets.some(t => h.includes(t));
            });
          };

          const nameIdx = getIdx(['NAMA'], true);
          const name = nameIdx !== -1 ? String(row[nameIdx] || '').trim() : '';
          
          if (!name || name === 'NAMA' || name.startsWith('DATA')) return null;

          const nikIdx = getIdx(['NIK'], true);
          const nikRaw = nikIdx !== -1 ? String(row[nikIdx] || '').trim() : '';
          
          const kkIdx = getIdx(['NO KARTU KELUARGA', 'NOMOR KK', 'NO KK'], false);
          const kkRaw = kkIdx !== -1 ? String(row[kkIdx] || '').trim() : '';

          const nik = nikRaw.replace(/[^0-9]/g, '');
          let kk = kkRaw.replace(/[^0-9]/g, '');

          // LOGIKA KK CERDAS (Forward Fill):
          // Jika baris ini KK-nya kosong, gunakan KK dari baris di atasnya (Kepala Keluarga)
          if (kk.length >= 15) {
            lastValidKK = kk;
          } else {
            kk = lastValidKK;
          }

          // TTL Parsing
          const ttlIdx = getIdx(['TEMPAT TANGGAL LAHIR', 'TTL'], false);
          let birthPlace = '';
          let birthDate = null;
          if (ttlIdx !== -1) {
            const ttl = String(row[ttlIdx] || '');
            if (ttl.includes(',')) {
               const parts = ttl.split(',');
               birthPlace = parts[0].trim();
               const dateStr = parts[1].trim();
               const dParts = dateStr.split(/[-/]/);
               if (dParts.length === 3) {
                 birthDate = `${dParts[2]}-${dParts[1]}-${dParts[0]}`;
               }
            }
          }

          // GENDER LOGIC
          let gender: 'L' | 'P' = 'L';
          const lakiIdx = getIdx(['LAKI-LAKI', 'LAKI LAKI', 'L'], true);
          const pereIdx = getIdx(['PEREMPUAN', 'P'], true);
          const valLaki = lakiIdx !== -1 ? String(row[lakiIdx] || '').trim() : '';
          const valPere = pereIdx !== -1 ? String(row[pereIdx] || '').trim() : '';
          if (valPere.length > 0 && valLaki.length === 0) gender = 'P';

          // ORTU LOGIC
          const statusIdx = getIdx(['STATUS'], true);
          let statusValue = statusIdx !== -1 ? String(row[statusIdx] || '').trim().toUpperCase() : '';
          
          // NORMALISASI STATUS (Hubungan Keluarga)
          const statusMap: Record<string, string> = {
            'KP KELUARGA': 'KEPALA KELUARGA',
            'KP. KELUARGA': 'KEPALA KELUARGA',
            'KEP.': 'KEPALA KELUARGA',
            'ISTERI': 'ISTRI',
            'K KELUARGA': 'KEPALA KELUARGA',
          };
          
          statusValue = statusMap[statusValue] || statusValue;

          // Inferred Marital Status
          let inferredMarital = 'Belum Kawin';
          if (['SUAMI', 'ISTRI', 'KEPALA KELUARGA', 'KP KELUARGA', 'ISTERI'].includes(statusValue)) {
            inferredMarital = 'Kawin';
          }

          const ayahIdx = statusIdx !== -1 ? statusIdx + 1 : -1;
          const ibuIdx = statusIdx !== -1 ? statusIdx + 2 : -1;
          const ayah = ayahIdx !== -1 ? String(row[ayahIdx] || '').trim() : '';
          const ibu = ibuIdx !== -1 ? String(row[ibuIdx] || '').trim() : '';

          return {
            nik: (nik.length >= 15) ? nik : '0000000000000000',
            kk: (kk.length >= 15) ? kk : (nik.length >= 15 ? nik : '0000000000000000'),
            name,
            birth_place: birthPlace,
            birth_date: birthDate,
            gender,
            education: String(row[getIdx(['PENDIDIKAN'], true)] || '').trim(),
            occupation: String(row[getIdx(['PEKERJAAN'], true)] || '').trim(),
            marital_status: inferredMarital,
            family_relationship: statusValue,
            father_name: ayah,
            mother_name: ibu,
            dusun: sheetName.replace('DATA PENDUDUK DUSUN ', '').trim(),
            rt: '',
            rw: '',
            data_year: currentYear
          };
        }).filter((d): d is ResidentInput => d !== null);

        allFormattedData = [...allFormattedData, ...sheetProcessedData];
        setLogs(prev => [...prev, `Sheet ${sheetName}: ${sheetProcessedData.length} data siap.`]);
      }

      if (allFormattedData.length === 0) {
        setLogs(prev => [...prev, 'ERROR: Data tidak terbaca.']);
        setLoading(false);
        return;
      }

      // DEDUPLIKASI & TANGGAL CLEANUP
      const uniqueDataMap = new Map<string, ResidentInput>();
      allFormattedData.forEach(item => {
        const key = `${item.nik}-${item.data_year}`;
        uniqueDataMap.set(key, item);
      });
      const uniqueFormattedData = Array.from(uniqueDataMap.values());

      const finalCleanData = uniqueFormattedData.map(item => {
        if (!item.birth_date) return item;
        const parts = item.birth_date.split('-').map(p => p.replace(/[^0-9]/g, ''));
        if (parts.length !== 3) return { ...item, birth_date: null };
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        const date = new Date(y, m - 1, d);
        const isValid = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
        if (!isValid) return { ...item, birth_date: null };
        return { ...item, birth_date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` };
      });

      const BATCH_SIZE = 100;
      let totalSuccess = 0;
      for (let i = 0; i < finalCleanData.length; i += BATCH_SIZE) {
        const batch = finalCleanData.slice(i, i + BATCH_SIZE);
        const result = await importResidents(batch);
        if (result.success && result.data) totalSuccess += result.data.count || 0;
      }

      setLogs(prev => [...prev, `IMPOR SELESAI! Total Sukses: ${totalSuccess} data.`]);
      setLoading(false);
      setSuccess(`Berhasil mengimpor ${totalSuccess} data penduduk! Mengalihkan...`);

      // Redirect ke halaman statistik setelah sukses
      if (totalSuccess > 0) {
        setTimeout(() => {
          router.push('/admin/statistics');
        }, 2000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setLogs(prev => [...prev, `ERROR FATAL: ${msg}`]);
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="mb-6">
        <Link 
          href="/admin/statistics" 
          className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors font-bold uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft size={18} />
          Kembali ke Statistik
        </Link>
      </div>

      <div className="bg-card rounded-[3rem] border border-border shadow-2xl overflow-hidden">
        <div className="p-10 border-b border-border bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-4 tracking-tighter uppercase">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <FileSpreadsheet size={28} />
              </div>
              Impor Data Master
            </h1>
            <p className="text-muted-foreground font-medium italic">Sistem otomatis memetakan nomor KK bagi anggota keluarga.</p>
          </div>
          
          <div className="bg-background p-5 rounded-[2rem] border border-border shadow-sm text-center min-w-[140px]">
            <span className="block text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-1">Tahun Data</span>
            <span className="text-2xl font-bold text-foreground tracking-tighter">{currentYear}</span>
          </div>
        </div>

        <div className="px-10 pt-10">
          {error && (
            <div className="p-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-[2rem] text-sm font-bold flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
              <ShieldAlert size={24} />
              {error}
            </div>
          )}
          {success && (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-[2rem] text-sm font-bold uppercase tracking-widest flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={24} />
              {success}
            </div>
          )}
        </div>

        <div className={`p-10 space-y-10 transition-opacity duration-500 ${success ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          {!file ? (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-4 border-dashed rounded-[3rem] p-24 text-center transition-all group cursor-pointer
                ${isDragging ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-border bg-muted/10 hover:border-primary/30 hover:bg-muted/30'}
              `}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 bg-background rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform border border-border">
                <FileSpreadsheet size={48} className="text-primary/40 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xl font-bold text-foreground tracking-tight hover:text-primary transition-colors">Unggah File Desa (.xlsx)</p>
              <p className="text-muted-foreground mt-2 font-medium">Nomor KK yang kosong otomatis mengikuti baris di atasnya.</p>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/20 flex items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <FileSpreadsheet size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground tracking-tight">{file.name}</h3>
                    <p className="text-primary text-[10px] font-bold uppercase tracking-widest mt-1">{(file.size / 1024).toFixed(1)} KB • Siap Impor</p>
                  </div>
                </div>
                <button 
                  onClick={reset}
                  className="p-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all border border-transparent hover:border-destructive/20"
                >
                  <Trash2 size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Daftar Dusun:</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sheets.map((sheetName) => (
                    <div key={sheetName} className="p-6 bg-muted/30 rounded-3xl border border-border flex items-center justify-between group hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-primary/60 group-hover:text-primary border border-border transition-colors">
                          <BarChart size={20} />
                        </div>
                        <span className="font-bold text-foreground uppercase text-sm tracking-tight">{sheetName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-background border border-border rounded-[2.5rem] shadow-inner">
                <div className="flex items-center gap-3 mb-4">
                  <Activity size={18} className="text-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Proses Log:</span>
                </div>
                <div className="p-6 bg-muted/30 text-primary/80 rounded-2xl font-mono text-xs border border-border leading-relaxed max-h-60 overflow-y-auto">
                  {logs.length > 0 ? logs.map((log, i) => <div key={i} className="mb-1">{`> ${log}`}</div>) : '> Menunggu perintah...'}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-10 bg-muted/30 border-t border-border flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file || loading || sheets.length === 0}
            className="w-full sm:w-auto bg-primary text-primary-foreground px-12 py-5 rounded-full font-bold flex items-center justify-center gap-4 hover:opacity-90 disabled:opacity-30 disabled:grayscale transition-all shadow-2xl shadow-primary/30 active:scale-95 text-sm tracking-widest uppercase"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
            {loading ? 'Mengirim Data...' : 'Mulai Impor Data'}
          </button>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx, .xls"
        className="hidden"
      />
    </div>
  );
}

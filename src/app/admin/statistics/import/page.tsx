'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { importResidents, ResidentImportData } from '@/actions/residents';

interface SheetMappingConfig {
  targetDusun: string;
  included: boolean;
  headers: string[];
  headerRowIndex: number;
}

export default function ImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataYear, setDataYear] = useState(2025);
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  const [sheetMapping, setSheetMapping] = useState<Record<string, SheetMappingConfig>>({});
  const [isMappingVisible, setIsMappingVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const parseExcelDate = (dateStr: string) => {
    if (!dateStr) return null;
    const clean = String(dateStr).trim();
    let year: number | null = null;
    let month: number | null = null;
    let day: number | null = null;
    
    const parts = clean.split(/[-/.]/);
    if (parts.length === 3) {
      const p0 = parts[0].trim();
      const p1 = parts[1].trim();
      const p2 = parts[2].trim();

      if (p0.length === 4) {
        year = parseInt(p0); month = parseInt(p1); day = parseInt(p2);
      } else if (p2.length === 4) {
        year = parseInt(p2); month = parseInt(p1); day = parseInt(p0);
      } else if (p2.length === 2) {
        year = parseInt(p2) > 30 ? 1900 + parseInt(p2) : 2000 + parseInt(p2);
        month = parseInt(p1); day = parseInt(p0);
      }
    } else if (clean.length === 4 && !isNaN(Number(clean)) && Number(clean) > 1900) {
      year = parseInt(clean); month = 1; day = 1;
    }

    if (year && month && day) {
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year > 1850 && year < 2100) {
        const dateObj = new Date(year, month - 1, day);
        if (
          dateObj.getFullYear() === year && 
          dateObj.getMonth() === month - 1 && 
          dateObj.getDate() === day
        ) {
          return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
      }
    }

    return null; 
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      analyzeExcel(selectedFile);
    }
  };

  const analyzeExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const mapping: Record<string, SheetMappingConfig> = {};

      workbook.SheetNames.forEach(name => {
        const worksheet = workbook.Sheets[name];
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:Z20');
        const rows: (string | number | boolean | null)[][] = [];
        
        for (let R = 0; R <= Math.min(range.e.r, 20); ++R) {
          const row = [];
          for (let C = 0; C <= range.e.c; ++C) {
            const cell = worksheet[XLSX.utils.encode_cell({r:R, c:C})];
            row.push(cell ? (cell.v as string | number | boolean) : null);
          }
          rows.push(row);
        }

        let headerRowIndex = -1;
        let headers: string[] = [];
        let extractedTitle = '';

        for (let i = 0; i < rows.length; i++) {
          const rowStr = rows[i].map(c => String(c || '').toUpperCase().trim()).join(' ');
          if (rowStr.includes('DUSUN') && !extractedTitle) {
            const match = rowStr.match(/DUSUN\s+([A-Z\s\.\-_]+)/i);
            if (match) extractedTitle = match[1].replace(/\d+/g, '').trim();
          }
          if (rowStr.includes('NIK') || rowStr.includes('NAMA') || rowStr.includes('NO KARTU KELUARGA')) {
            headerRowIndex = i;
            headers = rows[i].map(h => String(h || '').trim());
            break;
          }
        }

        const isSummary = /T\.U|K\.U|KESIMPULAN|UMUR/i.test(name);
        const hasCriticalColumns = headers.some(h => ['NIK', 'NAMA', 'NO KARTU KELUARGA'].includes(h.toUpperCase()));
        const isDataSheet = headerRowIndex !== -1 && hasCriticalColumns;

        mapping[name] = {
          targetDusun: isDataSheet && !isSummary ? (extractedTitle || name) : '',
          included: isDataSheet && !isSummary,
          headers: headers,
          headerRowIndex: headerRowIndex
        };
      });
      setSheetMapping(mapping);
      setIsMappingVisible(true);
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setStatus(null);
    setDebugInfo('');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const binaryData = e.target?.result;
        const workbook = XLSX.read(binaryData, { type: 'binary' });
        const uniqueDataMap = new Map<string, ResidentImportData>();

        Object.entries(sheetMapping).forEach(([sheetName, config]) => {
          if (!config.included || !config.targetDusun) return;

          const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { 
            range: config.headerRowIndex,
            defval: '' 
          }) as Record<string, string | number | boolean>[];

          rows.forEach((row) => {
            const cleanRow: Record<string, string | number | boolean> = {};
            Object.keys(row).forEach(key => {
              cleanRow[key.trim().toUpperCase()] = row[key];
            });

            const nik = String(cleanRow['NIK'] || '').trim();
            const nama = String(cleanRow['NAMA'] || '').trim();
            if (!nik || nik === 'null' || nik.length < 5 || !nama || nama.toUpperCase().includes('TOTAL')) return;

            const tglLahirRaw = String(cleanRow['TEMPAT TANGGAL LAHIR'] || '');
            const birthDatePart = tglLahirRaw.includes(',') ? tglLahirRaw.split(',')[1] : String(cleanRow['TAHUN LAHIR'] || '');

            // DETEKSI GENDER MULTI-ALIAS (Mendukung semua format Dusun Anda)
            let gender: 'L' | 'P' | null = null; 
            
            // Cari nilai di kolom Laki-laki (Mendukung: L, LAKI-LAKI, LAKI LAKI, PRIA)
            const maleAliases = ['L', 'LAKI-LAKI', 'LAKI LAKI', 'LAKI', 'PRIA'];
            const valL = maleAliases
              .map(alias => String(cleanRow[alias] || '').trim().replace('.0', ''))
              .find(v => v !== '' && v !== '0' && v !== 'null');

            // Cari nilai di kolom Perempuan (Mendukung: P, PEREMPUAN, WANITA)
            const femaleAliases = ['P', 'PEREMPUAN', 'WANITA'];
            const valP = femaleAliases
              .map(alias => String(cleanRow[alias] || '').trim().replace('.0', ''))
              .find(v => v !== '' && v !== '0' && v !== 'null');
            
            if (valL) {
              gender = 'L';
            } else if (valP) {
              gender = 'P';
            }

            uniqueDataMap.set(nik, {
              nik: nik,
              kk: String(cleanRow['NO KARTU KELUARGA'] || cleanRow['NO KK'] || ''),
              name: nama,
              birth_place: tglLahirRaw.split(',')[0] || '',
              birth_date: parseExcelDate(birthDatePart),
              gender: gender as 'L' | 'P',
              education: String(cleanRow['PENDIDIKAN'] || ''),
              occupation: String(cleanRow['PEKERJAAN'] || ''),
              marital_status: String(cleanRow['STATUS'] || ''),
              father_name: String(cleanRow['NAMA ORTU'] || cleanRow['AYAH'] || ''),
              mother_name: String(cleanRow['IBU'] || ''),
              dusun: config.targetDusun,
              rt: String(cleanRow['RT'] || ''),
              rw: String(cleanRow['RW'] || ''),
              data_year: dataYear
            });
          });
        });

        const allData = Array.from(uniqueDataMap.values());

        if (allData.length === 0) {
          setStatus({ type: 'error', message: 'Tidak ada data valid ditemukan.' });
          setLoading(false);
          return;
        }

        setDebugInfo(`Memproses ${allData.length} baris data...`);
        const result = await importResidents(allData);
        if (result.success) {
          setStatus({ type: 'success', message: `Berhasil Sinkronisasi ${result.count} data!` });
          setTimeout(() => router.push('/admin/statistics'), 2000);
        } else {
          setStatus({ type: 'error', message: result.error || 'Gagal.' });
        }
        setLoading(false);
      };
      reader.readAsBinaryString(file);
    } catch {
      setStatus({ type: 'error', message: 'Terjadi kesalahan sistem.' });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/admin/statistics" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors">
          <ArrowLeft size={18} /> Kembali
        </Link>
        <div className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold italic">
          v4: ROBUST DATA CLEANER
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 italic tracking-tighter">
              <Upload className="text-emerald-600" /> SINKRONISASI PENDUDUK
            </h1>
            <p className="text-sm text-slate-500">Sistem otomatis mengabaikan baris sampah.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="block text-[10px] font-bold text-slate-400">DATA TAHUN</span>
            <input type="number" value={dataYear} onChange={(e) => setDataYear(parseInt(e.target.value))} className="w-16 text-center font-black text-emerald-600 focus:outline-none bg-transparent" />
          </div>
        </div>

        <div className="p-8 space-y-8">
          {!isMappingVisible ? (
            <div className="relative group">
              <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl p-20 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all">
                <FileSpreadsheet size={48} className="mx-auto mb-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                <p className="font-bold text-slate-700 dark:text-slate-300">Pilih File Master Desa</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-3">
                {Object.entries(sheetMapping).filter(([, config]) => config.included).map(([sheetName, config]) => (
                  <div key={sheetName} className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/20 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm shadow-emerald-500/10">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-emerald-600 shadow-sm" size={24} />
                      <span className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tight">{sheetName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase">IDENTIFIER:</span>
                      <input 
                        type="text"
                        value={config.targetDusun}
                        onChange={(e) => setSheetMapping(prev => ({...prev, [sheetName]: {...prev[sheetName], targetDusun: e.target.value}}))}
                        className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-black text-emerald-600 focus:border-emerald-500 outline-none w-56 shadow-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {debugInfo && (
                <div className="p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-xs border border-slate-800">
                  &gt; {debugInfo}
                </div>
              )}

              {status && (
                <div className={`p-6 rounded-2xl flex items-center gap-4 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-100 shadow-lg shadow-emerald-500/10' : 'bg-red-50 text-red-700 border-2 border-red-100 shadow-lg shadow-red-500/10'}`}>
                  {status.type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                  <p className="font-black text-lg">{status.message}</p>
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={loading || !Object.values(sheetMapping).some(m => m.included && m.targetDusun)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black py-6 rounded-3xl shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-4 text-xl tracking-tighter transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={28} /> : <CheckCircle2 size={28} />}
                {loading ? 'MENYINKRONKAN MASTER...' : 'KONFIRMASI & SINKRONKAN'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

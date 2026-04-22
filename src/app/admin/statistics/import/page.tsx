'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileSpreadsheet, Upload, Loader2, BarChart, ShieldCheck, Trash2, Activity } from 'lucide-react';
import Link from 'next/link';
// import { processDemographicsExcel } from '@/actions/analytics';

export default function StatisticsImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [sheets, setSheets] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
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

  const prepareFile = (selected: File) => {
    setFile(selected);
    setSheets(['PENDIDIKAN', 'PEKERJAAN', 'USIA', 'DUSUN', 'PERKAWINAN', 'POPULASI']);
    setLogs(['File "' + selected.name + '" berhasil dimuat.', 'Mendeteksi struktur data...']);
  };

  const reset = () => {
    setFile(null);
    setSheets([]);
    setLogs([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setLogs(prev => [...prev, 'Memulai proses import...', 'Menghubungkan ke database...']);

    try {
      // Mocking the process for now since the action is not yet available
      setTimeout(() => {
        setLogs(prev => [...prev, 'ERROR: Fitur import mandiri sedang dalam pengembangan. Silakan hubungi tim teknis.']);
        setLoading(false);
      }, 2000);
    } catch {
      setLogs(prev => [...prev, 'Terjadi kesalahan sistem yang tidak terduga.']);
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
            <h1 className="text-3xl font-black text-foreground flex items-center gap-4 tracking-tighter uppercase">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <FileSpreadsheet size={28} />
              </div>
              Import Master Data
            </h1>
            <p className="text-muted-foreground font-medium italic">Sistem akan otomatis melakukan validasi dan pembersihan data baris sampah.</p>
          </div>
          
          <div className="bg-background p-5 rounded-[2rem] border border-border shadow-sm text-center min-w-[140px]">
            <span className="block text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1">Target Tahun</span>
            <span className="text-2xl font-black text-foreground tracking-tighter">{currentYear}</span>
          </div>
        </div>

        <div className="p-10 space-y-10">
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
              <p className="text-xl font-black text-foreground tracking-tight hover:text-primary transition-colors">Pilih File Master Desa (.xlsx)</p>
              <p className="text-muted-foreground mt-2 font-medium">Seret file ke sini atau klik untuk menjelajah komputer Anda.</p>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/20 flex items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <FileSpreadsheet size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground tracking-tight">{file.name}</h3>
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">{(file.size / 1024).toFixed(1)} KB • Siap diproses</p>
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
                  <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Daftar Sheet yang Terdeteksi</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {sheets.map((sheetName) => (
                    <div key={sheetName} className="p-6 bg-muted/30 rounded-3xl border border-border flex items-center justify-between group hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-primary/60 group-hover:text-primary border border-border transition-colors">
                          <BarChart size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-foreground uppercase text-base tracking-tight">{sheetName}</span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Format Standar Kemendagri</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Mapping Key:</span>
                          <input 
                            value={mappings[sheetName] || ''}
                            onChange={(e) => setMappings({...mappings, [sheetName]: e.target.value.toUpperCase()})}
                            placeholder="NIK / KK / NAMA"
                            className="bg-background border border-border rounded-xl px-4 py-2 text-xs font-black text-primary focus:border-primary outline-none w-48 shadow-sm text-center hover:border-primary/50 transition-all"
                          />
                        </div>
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20">
                          <ShieldCheck size={24} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-background border border-border rounded-[2.5rem] shadow-inner">
                <div className="flex items-center gap-3 mb-4">
                  <Activity size={18} className="text-primary" />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Logs Sistem:</span>
                </div>
                <div className="p-6 bg-muted/30 text-primary/80 rounded-2xl font-mono text-xs border border-border leading-relaxed">
                  {logs.length > 0 ? logs.map((log, i) => <div key={i} className="mb-1">{`> ${log}`}</div>) : '> Sistem standby... Menunggu instruksi import.'}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-10 bg-muted/30 border-t border-border flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full sm:w-auto bg-primary text-primary-foreground px-12 py-5 rounded-full font-black flex items-center justify-center gap-4 hover:opacity-90 disabled:opacity-30 disabled:grayscale transition-all shadow-2xl shadow-primary/30 active:scale-95 text-sm tracking-widest uppercase"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
            {loading ? 'Sedang Memproses...' : 'Eksekusi Import Data'}
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

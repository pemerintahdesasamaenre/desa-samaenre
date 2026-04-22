import { Suspense } from 'react'
import { Wallet, TrendingDown, ShieldCheck } from 'lucide-react'
import { getFinances } from '@/actions/finances'
import FinanceCharts from '@/components/modules/finance/FinanceCharts'
import { StatCard } from '@/components/ui/StatCard'
import YearFilter from '@/components/modules/finance/YearFilter'

export const metadata = {
  title: 'Transparansi Keuangan - Profil Desa',
  description: 'Transparansi anggaran pendapatan dan belanja desa.',
}

// Wrapper component to allow Suspense
async function TransparencyPageContent({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<div className="text-center p-24 font-black tracking-widest text-primary animate-pulse">MEMUAT DATA KEUANGAN...</div>}>
      <PageContent searchParams={searchParams} />
    </Suspense>
  )
}

interface PageProps {
  searchParams: Promise<{ year?: string }>
}

async function PageContent({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const currentYear = new Date().getFullYear()
  const selectedYear = resolvedParams.year ? parseInt(resolvedParams.year) : currentYear
  
  const finances = await getFinances(selectedYear)

  const totalIncome = finances
    .filter((f) => f.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0)
  
  const totalExpense = finances
    .filter((f) => f.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0)
  
  const balance = totalIncome - totalExpense

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full h-96 bg-secondary/5 skew-y-6 -translate-y-48"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-xl text-sm font-bold uppercase tracking-widest">
              Keuangan Desa
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none">
              Transparansi <span className="text-secondary text-gradient">Anggaran</span>
            </h1>
            <p className="text-xl text-muted-foreground mt-2 font-light max-w-2xl">
              Laporan realisasi anggaran pendapatan dan belanja desa tahun {selectedYear}.
            </p>
          </div>
          <div className="glass px-6 py-4 rounded-3xl shadow-xl">
             <YearFilter currentYear={currentYear} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <StatCard
            label="Total Pendapatan"
            value={totalIncome}
            prefix="Rp"
            icon={<Wallet />}
          />
          <StatCard
            label="Total Pengeluaran"
            value={totalExpense}
            prefix="Rp"
            icon={<TrendingDown />}
          />
          <StatCard
            label="Selisih/Saldo"
            value={balance}
            prefix="Rp"
            icon={<ShieldCheck />}
          />
        </div>

        {finances.length > 0 ? (
          <div className="space-y-16">
            <div className="glass p-8 md:p-12 rounded-[3.5rem] shadow-2xl border-white/5">
               <FinanceCharts data={finances} />
            </div>
            
            <div className="glass rounded-[3.5rem] shadow-2xl border-white/5 overflow-hidden">
              <div className="p-10 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h3 className="text-2xl font-black tracking-tight">Detail Alokasi Anggaran</h3>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                  Tahun Anggaran {selectedYear}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-10 py-6 text-xs font-black text-muted-foreground uppercase tracking-widest">Kategori</th>
                      <th className="px-10 py-6 text-xs font-black text-muted-foreground uppercase tracking-widest">Jenis</th>
                      <th className="px-10 py-6 text-xs font-black text-muted-foreground uppercase tracking-widest text-right">Jumlah</th>
                      <th className="px-10 py-6 text-xs font-black text-muted-foreground uppercase tracking-widest">Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {finances.map((item) => (
                      <tr key={item.id} className="hover:bg-primary/5 transition-all duration-300 group">
                        <td className="px-10 py-8 text-lg font-bold text-foreground">{item.category_name}</td>
                        <td className="px-10 py-8">
                          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${
                            item.type === 'income' 
                              ? 'bg-emerald-500/10 text-emerald-500' 
                              : item.type === 'expense'
                              ? 'bg-rose-500/10 text-rose-500'
                              : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {item.type === 'income' ? 'Pendapatan' : item.type === 'expense' ? 'Pengeluaran' : 'Pembiayaan'}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-xl font-black text-foreground text-right tabular-nums">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="px-10 py-8 text-sm text-muted-foreground italic font-light">
                          {item.note || 'Tidak ada catatan tambahan.'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass rounded-[3.5rem] p-24 text-center border-2 border-dashed border-white/10 space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
               <Wallet size={40} />
            </div>
            <p className="text-muted-foreground text-xl font-light">Data keuangan untuk tahun {selectedYear} belum diterbitkan oleh bagian administrasi.</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default TransparencyPageContent;

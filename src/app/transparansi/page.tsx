import { Suspense } from 'react'
import { getFinances } from '@/actions/finances'
import FinanceCharts from '@/components/modules/finance/FinanceCharts'
import { StatCard } from '@/components/ui/StatCard'
import YearFilter from '@/components/modules/finance/YearFilter'

export const metadata = {
  title: 'Transparansi Keuangan - Profil Desa',
  description: 'Transparansi anggaran pendapatan dan belanja desa.',
}

// Wrapper component to allow Suspense
function TransparencyPageContent({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<div className="text-center p-12">Memuat data...</div>}>
      <PageContent searchParams={searchParams} />
    </Suspense>
  )
}

interface PageProps {
  searchParams: { year?: string }
}

async function PageContent({ searchParams }: PageProps) {
  const currentYear = new Date().getFullYear()
  const selectedYear = searchParams.year ? parseInt(searchParams.year) : currentYear
  
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
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Transparansi Keuangan</h1>
          <p className="text-slate-600 mt-2">
            Laporan realisasi anggaran pendapatan dan belanja desa tahun {selectedYear}.
          </p>
        </div>
        <YearFilter currentYear={currentYear} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total Pendapatan"
          value={formatCurrency(totalIncome)}
        />
        <StatCard
          label="Total Pengeluaran"
          value={formatCurrency(totalExpense)}
        />
        <StatCard
          label="Selisih/Saldo"
          value={formatCurrency(balance)}
        />
      </div>

      {finances.length > 0 ? (
        <div className="space-y-8">
          <FinanceCharts data={finances} />
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold">Detail Anggaran</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-slate-900">Kategori</th>
                    <th className="px-6 py-3 text-sm font-semibold text-slate-900">Jenis</th>
                    <th className="px-6 py-3 text-sm font-semibold text-slate-900 text-right">Jumlah</th>
                    <th className="px-6 py-3 text-sm font-semibold text-slate-900">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {finances.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-700">{item.category_name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.type === 'income' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : item.type === 'expense'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.type === 'income' ? 'Pendapatan' : item.type === 'expense' ? 'Pengeluaran' : 'Pembiayaan'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 text-right font-medium">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{item.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-dashed border-slate-300">
          <p className="text-slate-500">Data keuangan untuk tahun {selectedYear} belum tersedia.</p>
        </div>
      )}
    </main>
  )
}

export default TransparencyPageContent;

'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import type { Finance } from '@/types'

interface FinanceChartsProps {
  data: Finance[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function FinanceCharts({ data }: FinanceChartsProps) {
  const summaryData = useMemo(() => {
    const income = data
      .filter((item) => item.type === 'income')
      .reduce((acc, item) => acc + item.amount, 0)
    const expense = data
      .filter((item) => item.type === 'expense')
      .reduce((acc, item) => acc + item.amount, 0)

    return [
      { name: 'Pendapatan', total: income },
      { name: 'Pengeluaran', total: expense },
    ]
  }, [data])

  const incomeByCategory = useMemo(() => {
    const categories: Record<string, number> = {}
    data
      .filter((item) => item.type === 'income')
      .forEach((item) => {
        categories[item.category_name] = (categories[item.category_name] || 0) + item.amount
      })
    return Object.entries(categories).map(([name, value]) => ({ name, value }))
  }, [data])

  const expenseByCategory = useMemo(() => {
    const categories: Record<string, number> = {}
    data
      .filter((item) => item.type === 'expense')
      .forEach((item) => {
        categories[item.category_name] = (categories[item.category_name] || 0) + item.amount
      })
    return Object.entries(categories).map(([name, value]) => ({ name, value }))
  }, [data])

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold mb-6">Ringkasan Anggaran</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `Rp ${value / 1e6}jt`} />
              <Tooltip 
                formatter={(value: any) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {summaryData.map((dataEntry, index) => (
                  <Cell key={`cell-${index}`} fill={dataEntry.name === 'Pendapatan' ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Pendapatan Per Kategori</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {incomeByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Pengeluaran Per Kategori</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

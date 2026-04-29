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
    <div className="space-y-12">
      <div className="glass-premium p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10"></div>
        <h3 className="text-2xl font-bold mb-10 tracking-tight text-foreground">Ringkasan Anggaran</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/20" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 13, fontWeight: 800 }}
                className="text-foreground/70 dark:text-foreground/80"
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(value) => `Rp ${value / 1e6}jt`} 
                tick={{ fill: 'currentColor', fontSize: 13, fontWeight: 800 }}
                className="text-foreground/70 dark:text-foreground/80"
              />
              <Tooltip 
                cursor={{ fill: 'currentColor', className: 'text-primary/5' }}
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '1.5rem', 
                  boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                  backdropFilter: 'blur(20px)',
                  padding: '1.5rem',
                  fontSize: '14px',
                  fontWeight: 900
                }}
                itemStyle={{ color: 'var(--foreground)' }}
                labelStyle={{ color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                formatter={(value: any) => formatCurrency(Number(value || 0))} // eslint-disable-line @typescript-eslint/no-explicit-any
              />
              <Bar dataKey="total" radius={[12, 12, 0, 0]} barSize={60}>
                {summaryData.map((dataEntry, index) => (
                  <Cell key={`cell-${index}`} fill={dataEntry.name === 'Pendapatan' ? '#10b981' : '#f43f5e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="glass-premium p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          <h3 className="text-xl font-bold mb-8 tracking-tight text-foreground">Pendapatan Per Kategori</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {incomeByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: '1rem',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  formatter={(value: any) => formatCurrency(Number(value || 0))} // eslint-disable-line @typescript-eslint/no-explicit-any 
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-premium p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          <h3 className="text-xl font-bold mb-8 tracking-tight text-foreground">Pengeluarana Per Kategori</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {expenseByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: '1rem',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  formatter={(value: any) => formatCurrency(Number(value || 0))} // eslint-disable-line @typescript-eslint/no-explicit-any 
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

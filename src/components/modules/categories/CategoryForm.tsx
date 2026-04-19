'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory, updateCategory, type CategoryInput } from '@/actions/categories'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface CategoryFormProps {
  initialData?: CategoryInput & { id?: string }
  isEditing?: boolean
}

export default function CategoryForm({ initialData, isEditing }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CategoryInput>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    type: initialData?.type || 'post',
    description: initialData?.description || '',
  })

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    setFormData(prev => ({ ...prev, name, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = isEditing && initialData?.id
        ? await updateCategory(initialData.id, formData)
        : await createCategory(formData)

      if (result.error) {
        if (typeof result.error === 'object') {
          setError(Object.values(result.error).flat().join(', '))
        } else {
          setError(result.error)
        }
      } else {
        router.push('/admin/categories')
        router.refresh()
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/categories" 
          className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Kategori membantu mengelompokkan konten berita, demografi, atau galeri.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Kategori</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Contoh: Berita Utama, Data Penduduk, dll"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Slug (URL)</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tipe Konten</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="post">Berita & Agenda (Post)</option>
              <option value="demographic">Data Statistik (Demographic)</option>
              <option value="finance">Keuangan (Finance)</option>
              <option value="gallery">Galeri Foto (Gallery)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Deskripsi (Opsional)</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Penjelasan singkat mengenai kategori ini..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isEditing ? 'Simpan Perubahan' : 'Tambah Kategori'}
          </button>
        </div>
      </form>
    </div>
  )
}

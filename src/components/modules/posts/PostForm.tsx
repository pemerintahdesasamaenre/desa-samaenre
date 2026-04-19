'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost, updatePost } from '@/actions/posts'
import type { PostInput } from '@/lib/validations'
import { Save, Loader2, ArrowLeft, FolderOpen, Tag, Settings2 } from 'lucide-react'
import Link from 'next/link'
import CustomSelect from '@/components/ui/CustomSelect'

import ImageUpload from '@/components/ui/ImageUpload'

interface Category {
  id: string
  name: string
}

interface PostFormProps {
  categories: Category[]
  initialData?: PostInput & { id?: string }
  isEditing?: boolean
}

export default function PostForm({ categories, initialData, isEditing }: PostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toISOString().slice(0, 16)
    } catch (e) {
      return ''
    }
  }

  const [formData, setFormData] = useState<PostInput>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    image_url: initialData?.image_url || '',
    category_id: initialData?.category_id || '',
    type: initialData?.type || 'news',
    status: initialData?.status || 'draft',
    event_date: formatDateTime(initialData?.event_date),
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    setFormData(prev => ({ ...prev, title, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)
    setError(null)

    try {
      const result = isEditing && initialData?.id
        ? await updatePost(initialData.id, formData)
        : await createPost(formData)

      if (result.error) {
        if (typeof result.error === 'object') {
          setError(Object.values(result.error).flat().join(', '))
        } else {
          setError(result.error)
        }
      } else {
        router.push('/admin/posts')
        router.refresh()
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/posts" 
          className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isEditing ? 'Edit Postingan' : 'Buat Postingan Baru'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isEditing ? 'Perbarui informasi yang sudah dipublikasikan.' : 'Isi detail di bawah untuk membagikan informasi desa.'}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Judul</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Masukkan judul berita/agenda"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Slug (URL)</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <CustomSelect
            label="Kategori"
            placeholder="Pilih Kategori..."
            icon={FolderOpen}
            options={categories}
            value={formData.category_id || ''}
            onChange={(val) => setFormData(prev => ({ ...prev, category_id: val }))}
            required
          />

          <CustomSelect
            label="Tipe Konten"
            icon={Tag}
            options={[
              { id: 'news', name: 'Berita Desa' },
              { id: 'agenda', name: 'Agenda Kegiatan' }
            ]}
            value={formData.type}
            onChange={(val) => setFormData(prev => ({ ...prev, type: val as any }))}
            required
          />

          <CustomSelect
            label="Status Publikasi"
            icon={Settings2}
            options={[
              { id: 'draft', name: 'Draft (Simpan Internal)' },
              { id: 'published', name: 'Terbit (Publik)' }
            ]}
            value={formData.status}
            onChange={(val) => setFormData(prev => ({ ...prev, status: val as any }))}
            required
          />

          {formData.type === 'agenda' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tanggal Kegiatan</label>
              <input
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          )}

          <div className="md:col-span-2">
            <ImageUpload 
              label="Gambar Sampul"
              folder="posts"
              value={formData.image_url || ''}
              onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Konten</label>
            <textarea
              required
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Tulis isi berita atau detail agenda di sini..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-10 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isEditing ? 'Simpan Perubahan' : 'Publikasikan Postingan'}
          </button>
        </div>
      </form>
    </div>
  )
}

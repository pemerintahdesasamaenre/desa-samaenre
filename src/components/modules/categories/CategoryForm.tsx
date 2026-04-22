'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory, updateCategory, type CategoryInput } from '@/actions/categories'
import { Save, Loader2, ArrowLeft, Layers } from 'lucide-react'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

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
    } catch {
      setError('Terjadi kesalahan sistem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 px-4 sm:px-0">
      <div className="mb-6">
        <Link 
          href="/admin/categories" 
          className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors font-bold uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar
        </Link>
      </div>

      <div className="bg-card rounded-[3rem] border border-border shadow-sm overflow-hidden">
        <div className="p-10 border-b border-border bg-muted/30">
          <h2 className="text-3xl font-black text-foreground tracking-tighter">
            {isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h2>
          <p className="text-muted-foreground mt-2 font-medium">
            Kategori membantu mengelompokkan konten berita, demografi, atau galeri.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}

          <div className="space-y-10">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Layers size={18} />
              </div>
              Detail Kategori
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Nama Kategori</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Contoh: Berita Utama, Data Penduduk, dll"
                />
              </div>

              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Tipe Konten</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as CategoryInput['type'] }))}
                  className="w-full h-14 px-6 rounded-full border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold hover:border-primary/50"
                >
                  <option value="post">Berita & Agenda (Post)</option>
                  <option value="demographic">Data Statistik (Demographic)</option>
                  <option value="finance">Keuangan (Finance)</option>
                  <option value="gallery">Galeri Foto (Gallery)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Deskripsi (Opsional)</Label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-6 rounded-[2rem] border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none font-medium hover:border-primary/50"
                  placeholder="Penjelasan singkat mengenai kategori ini..."
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground px-12 py-5 rounded-full font-black flex items-center gap-4 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl shadow-primary/30 active:scale-95 text-sm tracking-widest uppercase"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isEditing ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory, updateCategory } from '@/actions/categories'
import { type CategoryInput } from '@/lib/validations'
import { Save, Loader2, ArrowLeft, Layers } from 'lucide-react'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import CustomSelect from '@/components/ui/CustomSelect'

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

    setFormData(prev => {
      const newData = { ...prev, name }

      if (!isEditing) {
        newData.slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      }

      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const toastId = toast.loading(isEditing ? 'Menyimpan kategori...' : 'Menambahkan kategori...')

    try {
      const result = isEditing && initialData?.id
        ? await updateCategory(initialData.id, formData)
        : await createCategory(formData)

      if (result.error) {
        const msg = typeof result.error === 'object'
          ? Object.values(result.error).flat().join(', ')
          : result.error
        setError(msg)
        toast.error('Gagal: ' + msg, { id: toastId })
      } else {
        toast.success(isEditing ? 'Kategori diperbarui!' : 'Kategori berhasil ditambahkan!', { id: toastId })
        setTimeout(() => {
          router.push('/admin/categories')
          router.refresh()
        }, 1500)
      }
    } catch {
      setError('Terjadi kesalahan sistem')
      toast.error('Terjadi kesalahan sistem', { id: toastId })
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

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 sm:p-10 border-b border-border bg-muted/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight uppercase">
            {isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            Kategori membantu mengelompokkan konten berita, demografi, atau galeri.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}

          <div className="space-y-8 sm:space-y-10">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
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

              <CustomSelect
                label="Tipe Konten"
                icon={Layers}
                options={[
                  { id: 'post', name: 'Berita & Pengumuman' },
                  { id: 'finance', name: 'Laporan Keuangan' },
                ]}
                value={formData.type}
                onChange={(val) => setFormData(prev => ({ ...prev, type: val as any }))}
                required
              />

              <div className="space-y-2">
                <Label>Deskripsi (Opsional)</Label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-5 rounded-2xl border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none font-medium hover:border-primary/50 text-sm"
                  placeholder="Penjelasan singkat mengenai kategori ini..."
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-primary text-primary-foreground px-12 py-4 rounded-full font-bold flex items-center gap-4 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/30 active:scale-95 text-xs sm:text-sm tracking-widest uppercase"
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

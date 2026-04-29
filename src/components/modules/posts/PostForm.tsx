'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost, updatePost } from '@/actions/posts'
import type { PostInput } from '@/lib/validations'
import { Save, Loader2, ArrowLeft, FolderOpen, Tag, Settings2, FileText } from 'lucide-react'
import Link from 'next/link'
import CustomSelect from '@/components/ui/CustomSelect'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import ImageUpload from '@/components/ui/ImageUpload'
import { toast } from 'sonner'

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
    } catch {
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
    const toastId = toast.loading(isEditing ? 'Memperbarui postingan...' : 'Mempublikasikan konten...')

    try {
      const result = isEditing && initialData?.id
        ? await updatePost(initialData.id, formData)
        : await createPost(formData)

      if (result.error) {
        const msg = typeof result.error === 'object' 
          ? Object.values(result.error).flat().join(', ') 
          : result.error
        setError(msg)
        toast.error('Gagal menyimpan: ' + msg, { id: toastId })
      } else {
        toast.success(isEditing ? 'Postingan diperbarui!' : 'Konten berhasil diterbitkan!', { id: toastId })
        setTimeout(() => {
          router.push('/admin/posts')
          router.refresh()
        }, 1500)
      }
    } catch {
      setError('Terjadi kesalahan sistem')
      toast.error('Kesalahan sistem tak terduga', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 sm:px-0">
      <div className="mb-6">
        <Link 
          href="/admin/posts" 
          className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors font-bold uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar
        </Link>
      </div>

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 sm:p-10 border-b border-border bg-muted/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight uppercase">
            {isEditing ? 'Edit Postingan' : 'Buat Postingan Baru'}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            {isEditing ? 'Perbarui informasi yang sudah dipublikasikan.' : 'Isi detail di bawah untuk membagikan informasi desa.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8 sm:space-y-10">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}

          <div className="space-y-8 sm:space-y-10">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <FileText size={18} />
              </div>
              Detail Informasi
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="md:col-span-2 space-y-2">
                <Label>Judul Konten</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Masukkan judul berita/agenda"
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
                onChange={(val) => setFormData(prev => ({ ...prev, type: val as 'news' | 'agenda' }))}
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
                onChange={(val) => setFormData(prev => ({ ...prev, status: val as 'draft' | 'published' }))}
                required
              />

              {formData.type === 'agenda' && (
                <div className="space-y-2">
                  <Label>Tanggal Kegiatan</Label>
                  <Input
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
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
                <Label>Konten Lengkap</Label>
                <textarea
                  required
                  rows={12}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none font-medium leading-relaxed hover:border-primary/50 text-sm sm:text-base"
                  placeholder="Tulis isi berita atau detail agenda di sini..."
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-primary text-primary-foreground px-12 py-4 rounded-full font-bold flex items-center justify-center gap-4 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/30 active:scale-95 text-xs sm:text-sm tracking-widest uppercase"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isEditing ? 'Simpan Perubahan' : 'Publikasikan Konten'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

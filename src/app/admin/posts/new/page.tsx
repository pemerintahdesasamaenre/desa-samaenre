import { getCategories } from '@/actions/posts'
import PostForm from '@/components/modules/posts/PostForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewPostPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6 bg-card p-6 rounded-3xl border border-border shadow-sm">
        <Link
          href="/admin/posts"
          className="p-4 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground rounded-2xl transition-all shadow-sm active:scale-95 group"
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground tracking-tighter">Buat Postingan</h1>
          <p className="text-muted-foreground font-medium italic mt-1">
            Publikasikan informasi berita atau agenda kegiatan terbaru untuk warga desa.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <PostForm categories={categories} />
      </div>
    </div>
  )
}

import { getCategories } from '@/actions/posts'
import PostForm from '@/components/modules/posts/PostForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewPostPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/posts"
          className="p-2.5 bg-white dark:bg-slate-900 text-slate-500 hover:text-blue-600 border border-slate-200 dark:border-slate-800 rounded-xl transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buat Postingan Baru</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Publikasikan informasi terbaru untuk warga desa.
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <PostForm categories={categories} />
      </div>
    </div>
  )
}

import { getPosts } from '@/actions/posts'
import Link from 'next/link'
import { Plus, Edit2, FileText, Calendar, Eye } from 'lucide-react'
import DeletePostButton from '@/components/modules/posts/DeletePostButton'

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Berita & Agenda</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Kelola publikasi informasi untuk warga desa.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 w-full md:w-auto"
        >
          <Plus size={20} />
          Buat Postingan
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Konten</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {posts.map((post: any) => (
                <tr key={post.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </span>
                      <span className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      {post.categories?.name || 'Tanpa Kategori'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      post.type === 'news' 
                        ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' 
                        : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'
                    }`}>
                      {post.type === 'news' ? 'BERITA' : 'AGENDA'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      post.status === 'published' 
                        ? 'text-blue-600' 
                        : 'text-slate-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        post.status === 'published' ? 'bg-blue-600' : 'bg-slate-300'
                      }`} />
                      {post.status === 'published' ? 'Terbit' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/posts/${post.slug}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        title="Lihat Publik"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/posts/edit/${post.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <DeletePostButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    Belum ada postingan yang dibuat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

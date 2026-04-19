import { getPosts } from '@/actions/posts'
import Link from 'next/link'
import { Plus, Edit2, FileText, Calendar, Eye } from 'lucide-react'
import DeletePostButton from '@/components/modules/posts/DeletePostButton'

interface PostWithCategory {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  type: 'news' | 'agenda';
  status: 'draft' | 'published';
  categories?: { name: string } | null;
}

export default async function PostsPage() {
  const posts = (await getPosts()) as unknown as PostWithCategory[]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Responsif */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Berita & Agenda</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">
            Kelola publikasi informasi untuk warga desa.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 w-full sm:w-auto text-sm md:text-base"
        >
          <Plus size={20} />
          Buat Postingan
        </Link>
      </div>

      {/* Grid Card untuk Mobile & Table untuk Desktop */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Konten</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe/Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {posts.map((post) => (
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
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
                      {post.categories?.name || 'Umum'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        post.type === 'news' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
                      }`}>
                        {post.type.toUpperCase()}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        post.status === 'published' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 bg-slate-100'
                      }`}>
                        {post.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/posts/${post.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Eye size={18} /></Link>
                      <Link href={`/admin/posts/edit/${post.id}`} className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Edit2 size={18} /></Link>
                      <DeletePostButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Card List) */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {posts.map((post) => (
            <div key={post.id} className="p-5 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white leading-snug">{post.title}</h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                      {post.categories?.name || 'Umum'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      post.type === 'news' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {post.type === 'news' ? 'BERITA' : 'AGENDA'}
                    </span>
                  </div>
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${
                  post.status === 'published' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {post.status.toUpperCase()}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/50">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(post.created_at).toLocaleDateString('id-ID')}
                </span>
                <div className="flex items-center gap-1">
                  <Link href={`/posts/${post.slug}`} className="p-2 text-slate-400"><Eye size={18} /></Link>
                  <Link href={`/admin/posts/edit/${post.id}`} className="p-2 text-slate-400"><Edit2 size={18} /></Link>
                  <DeletePostButton id={post.id} title={post.title} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            Belum ada postingan.
          </div>
        )}
      </div>
    </div>
  )
}

import Link from 'next/link'
import { Plus, Search, Filter, Calendar, FileText, MoreVertical, Trash2, Edit } from 'lucide-react'
import { getPosts, deletePost } from '@/actions/posts'
import { revalidatePath } from 'next/cache'

async function DeleteAction({ id }: { id: string }) {
  'use server'
  await deletePost(id)
  revalidatePath('/admin/posts')
}

export default async function AdminPostsPage() {
  const posts = await getPosts()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Berita & Agenda</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Kelola berita dan agenda kegiatan desa.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 w-fit"
        >
          <Plus size={20} />
          <span>Tambah Post</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Post</p>
              <h3 className="text-2xl font-bold">{posts.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Berita</p>
              <h3 className="text-2xl font-bold">{posts.filter(p => p.type === 'news').length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Agenda</p>
              <h3 className="text-2xl font-bold">{posts.filter(p => p.type === 'agenda').length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Judul</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Tipe</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Kategori</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Tanggal</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Belum ada postingan. Silakan tambah postingan baru.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-slate-100">{post.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.type === 'news' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {post.type === 'news' ? 'Berita' : 'Agenda'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {post.categories?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {post.status === 'published' ? 'Terbit' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(post.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Edit is not implemented yet but placeholder is fine */}
                        <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <Edit size={18} />
                        </button>
                        <form action={async () => {
                          'use server'
                          await deletePost(post.id)
                          revalidatePath('/admin/posts')
                        }}>
                          <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

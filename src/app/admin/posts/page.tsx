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
  views: number;
  categories?: { name: string } | null;
}

export default async function PostsPage() {
  const posts = (await getPosts()) as unknown as PostWithCategory[]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Responsif */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Berita & Agenda</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Kelola publikasi informasi untuk warga desa.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-bold transition-all shadow-lg shadow-primary/25 w-full sm:w-auto text-sm md:text-base hover:opacity-90"
        >
          <Plus size={20} />
          Buat Postingan
        </Link>
      </div>

      {/* Grid Card untuk Mobile & Table untuk Desktop */}
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Konten</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Kategori</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Pelihat</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors text-lg">
                        {post.title}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                        <Calendar size={12} className="text-primary" />
                        {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-muted rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {post.categories?.name || 'Umum'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-foreground font-bold">
                       <Eye size={16} className="text-primary" />
                       <span className="tabular-nums">{post.views.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                        post.type === 'news' ? 'text-emerald-600 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-600 border-amber-500/20 bg-amber-500/5'
                      }`}>
                        {post.type.toUpperCase()}
                      </span>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                        post.status === 'published' ? 'text-primary border-primary/20 bg-primary/5' : 'text-slate-500 border-slate-500/20 bg-slate-500/5'
                      }`}>
                        {post.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/posts/${post.slug}`} target="_blank" className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><Eye size={20} /></Link>
                      <Link href={`/admin/posts/edit/${post.id}`} className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><Edit2 size={20} /></Link>
                      <DeletePostButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Card List) */}
        <div className="md:hidden divide-y divide-border">
          {posts.map((post) => (
            <div key={post.id} className="p-6 space-y-5">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground leading-snug text-lg">{post.title}</h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[10px] font-black px-2 py-0.5 bg-muted rounded text-muted-foreground uppercase tracking-widest">
                      {post.categories?.name || 'Umum'}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                      post.type === 'news' ? 'text-emerald-600 border-emerald-500/10' : 'text-amber-600 border-amber-500/10'
                    }`}>
                      {post.type === 'news' ? 'BERITA' : 'AGENDA'}
                    </span>
                  </div>
                </div>
                <div className={`text-[10px] font-black px-2 py-1 rounded-full shrink-0 border ${
                  post.status === 'published' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border'
                }`}>
                  {post.status.toUpperCase()}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex gap-4 items-center">
                  <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(post.created_at).toLocaleDateString('id-ID')}
                  </span>
                  <span className="text-[10px] text-primary font-black flex items-center gap-1">
                    <Eye size={12} />
                    {post.views.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/posts/${post.slug}`} className="p-2 text-muted-foreground hover:text-primary"><Eye size={20} /></Link>
                  <Link href={`/admin/posts/edit/${post.id}`} className="p-2 text-muted-foreground hover:text-primary"><Edit2 size={20} /></Link>
                  <DeletePostButton id={post.id} title={post.title} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="p-20 text-center text-muted-foreground">
            <FileText size={64} className="mx-auto mb-4 opacity-10" />
            <p className="font-bold uppercase tracking-widest text-xs">Belum ada postingan.</p>
          </div>
        )}
      </div>
    </div>
  )
}

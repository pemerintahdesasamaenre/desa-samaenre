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
    <div className="space-y-10 pb-20 px-4 md:px-0">
      {/* Header Responsif */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground tracking-tighter">Berita & Agenda</h1>
          <p className="text-muted-foreground mt-2 font-medium italic">
            Kelola publikasi informasi dan agenda kegiatan untuk warga desa.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-black transition-all shadow-xl shadow-primary/25 w-full lg:w-auto uppercase text-xs tracking-widest hover:opacity-90 active:scale-95"
        >
          <Plus size={20} />
          Buat Postingan
        </Link>
      </div>

      {/* Grid Card untuk Mobile & Table untuk Desktop */}
      <div className="bg-card border border-border rounded-[3rem] overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-8 py-6 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Konten</th>
                <th className="px-8 py-6 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Kategori</th>
                <th className="px-8 py-6 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Pelihat</th>
                <th className="px-8 py-6 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-foreground group-hover:text-primary transition-colors text-lg tracking-tight leading-tight">
                        {post.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                        <Calendar size={12} className="text-primary/60" />
                        {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-muted rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-border/50">
                      {post.categories?.name || 'Umum'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-foreground font-black text-lg tracking-tighter">
                       <Eye size={18} className="text-primary" />
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
                        post.status === 'published' ? 'text-primary border-primary/20 bg-primary/10' : 'text-muted-foreground border-border bg-muted/30'
                      }`}>
                        {post.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/posts/${post.slug}`} target="_blank" className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-2xl transition-all border border-transparent hover:border-primary/20"><Eye size={20} /></Link>
                      <Link href={`/admin/posts/edit/${post.id}`} className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-2xl transition-all border border-transparent hover:border-primary/20"><Edit2 size={20} /></Link>
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
            <div key={post.id} className="p-6 space-y-6 hover:bg-muted/30 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-3">
                  <h3 className="font-black text-foreground leading-tight text-xl tracking-tight">{post.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 bg-muted rounded text-muted-foreground uppercase tracking-widest border border-border">
                      {post.categories?.name || 'Umum'}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                      post.type === 'news' ? 'text-emerald-600 border-emerald-500/10' : 'text-amber-600 border-amber-500/10'
                    }`}>
                      {post.type === 'news' ? 'BERITA' : 'AGENDA'}
                    </span>
                  </div>
                </div>
                <div className={`text-[10px] font-black px-3 py-1 rounded-full shrink-0 border ${
                  post.status === 'published' ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground border-border'
                }`}>
                  {post.status.toUpperCase()}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-5 border-t border-border">
                <div className="flex gap-4 items-center">
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary/60" />
                    {new Date(post.created_at).toLocaleDateString('id-ID')}
                  </span>
                  <span className="text-base text-foreground font-black flex items-center gap-1.5 tracking-tighter">
                    <Eye size={18} className="text-primary" />
                    {post.views.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/posts/${post.slug}`} className="p-3 text-muted-foreground hover:text-primary border border-border rounded-2xl"><Eye size={20} /></Link>
                  <Link href={`/admin/posts/edit/${post.id}`} className="p-3 text-muted-foreground hover:text-primary border border-border rounded-2xl"><Edit2 size={20} /></Link>
                  <DeletePostButton id={post.id} title={post.title} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="p-24 text-center">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText size={40} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Belum ada postingan tersedia.</p>
          </div>
        )}
      </div>
    </div>
  )
}

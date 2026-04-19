import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Share2, MessageCircle, ArrowLeft } from 'lucide-react';
import { getPostBySlug } from '@/actions/posts';

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      

      <main className="flex-1 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-96 bg-primary/5 skew-y-3 -translate-y-48"></div>

        <article className="max-w-4xl mx-auto px-4 relative z-10">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-bold mb-12 transition-all hover:-translate-x-2"
          >
            <ArrowLeft size={20} />
            KEMBALI KE BERITA
          </Link>

          <div className="glass rounded-[4rem] overflow-hidden shadow-2xl border-white/5">
            {/* Header Section */}
            <div className="p-10 md:p-20 space-y-10">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest">
                    {post.categories?.name || 'Berita'}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
                    <Calendar size={16} className="text-primary" />
                    <span>{new Date(post.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
                    <Clock size={16} className="text-primary" />
                    <span>5 mnt baca</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-tight text-gradient">
                  {post.title}
                </h1>

                <div className="flex items-center gap-4 py-8 border-y border-white/10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl shadow-inner">
                    A
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Penulis</p>
                    <p className="font-bold text-foreground text-lg">Administrator Desa</p>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              {post.image_url && (
                <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Body Content */}
              <div className="prose prose-xl prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:font-light prose-headings:font-black prose-p:text-muted-foreground">
                {post.content.split('\n').map((para: string, i: number) => (
                  para ? <p key={i} className="mb-8">{para}</p> : <br key={i} />
                ))}
              </div>

              {/* Footer / Sharing */}
              <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex items-center gap-6">
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Bagikan</span>
                  <div className="flex gap-4">
                    {[Share2, MessageCircle].map((Icon, idx) => (
                      <button key={idx} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all hover-lift">
                        <Icon size={20} />
                      </button>
                    ))}
                  </div>
                </div>

                <button className="flex items-center gap-3 px-8 py-4 glass rounded-2xl text-foreground font-bold hover:bg-primary hover:text-white transition-all hover-lift">
                  <Share2 size={18} />
                  Salin Tautan
                </button>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

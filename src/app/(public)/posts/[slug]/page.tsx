import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Eye } from 'lucide-react';
import { getPostBySlug } from '@/actions/posts';
import { incrementPostView } from '@/actions/analytics';
import Image from 'next/image';
import type { Metadata } from 'next';
import ShareButtons from '@/components/modules/posts/ShareButtons';
import { marked } from 'marked';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Berita Tidak Ditemukan',
    };
  }

  // Bersihkan konten dari simbol markdown untuk deskripsi SEO
  const description = post.content
    .replace(/[#*`_~\[\]]/g, '')
    .substring(0, 160)
    .trim() + '...';
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.slug}`;

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      url,
      type: 'article',
      publishedTime: post.created_at,
      images: post.image_url ? [{ url: post.image_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.image_url ? [post.image_url] : [],
    },
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  // Increment view counter automatically
  await incrementPostView(post.id);

  const postUrl = `${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.slug}`;

  // Parse markdown content to HTML
  const contentHtml = marked.parse(post.content || '');

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

          <div className="glass rounded-2xl overflow-hidden shadow-2xl border-white/5">
            {/* Header Section */}
            <div className="p-10 md:p-16 space-y-10">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-bold uppercase tracking-widest">
                    {post.categories?.name || 'Berita'}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
                    <Calendar size={16} className="text-primary" />
                    <span>
                      {post.type === 'agenda' && post.event_date ? 'Jadwal: ' : 'Terbit: '}
                      {new Date(post.type === 'agenda' && post.event_date ? post.event_date : post.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        ...(post.type === 'agenda' ? { hour: '2-digit', minute: '2-digit' } : {})
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
                    <Clock size={16} className="text-primary" />
                    <span>5 mnt baca</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
                    <Eye size={16} className="text-primary" />
                    <span>{post.views.toLocaleString()} pelihat</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tighter leading-tight text-gradient">
                  {post.title}
                </h1>

                <div className="flex items-center gap-4 py-8 border-y border-white/10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shadow-inner">
                    A
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Penulis</p>
                    <p className="font-bold text-foreground text-lg">Administrator Desa</p>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={(!post.image_url || post.image_url.includes('placeholder-bg.jpg'))
                    ? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'
                    : post.image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Body Content */}
              <div 
                className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:font-light prose-headings:font-bold prose-p:text-muted-foreground prose-a:text-primary prose-img:rounded-2xl prose-headings:text-foreground"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* Footer / Sharing Component */}
              <ShareButtons title={post.title} url={postUrl} />
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

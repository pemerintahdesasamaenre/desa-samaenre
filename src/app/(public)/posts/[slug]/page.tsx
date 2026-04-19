import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Eye } from 'lucide-react';
import { getPostBySlug } from '@/actions/posts';
import { incrementPostView } from '@/actions/analytics';
import Image from 'next/image';
import type { Metadata } from 'next';
import ShareButtons from '@/components/modules/posts/ShareButtons';

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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
                    <Eye size={16} className="text-primary" />
                    <span>{post.views.toLocaleString()} pelihat</span>
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
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Body Content */}
              <div className="prose prose-xl prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:font-light prose-headings:font-black prose-p:text-muted-foreground">
                {post.content.split('\n').map((para: string, i: number) => (
                  para ? <p key={i} className="mb-8">{para}</p> : <br key={i} />
                ))}
              </div>

              {/* Footer / Sharing Component */}
              <ShareButtons title={post.title} url={postUrl} />
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

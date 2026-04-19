// src/components/modules/home/LatestPosts.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ChevronRight, ImageIcon } from 'lucide-react';

interface Post {
  title: string;
  slug: string;
  image_url?: string | null;
  created_at: string;
  categories: { name: string } | null;
}

interface LatestPostsProps {
  posts: Post[];
}

export default function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <section className="py-32 px-4 bg-background relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-none animate-slide-up">
              Kabar <br/>
              <span className="text-gradient">Terbaru Desa</span>
            </h2>
            <p className="text-foreground/80 font-medium max-w-xl text-xl leading-relaxed">
              Tetap terhubung dengan perkembangan terbaru, kegiatan, dan pengumuman resmi dari desa kami.
            </p>
          </div>
          <Link 
            href="/posts" 
            className="group flex items-center gap-3 bg-secondary/10 dark:bg-white/5 border border-secondary/20 dark:border-white/10 px-8 py-4 rounded-2xl font-black hover:bg-primary hover:text-white transition-all duration-500"
          >
            Lihat Semua Berita
            <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/posts/${post.slug}`}
              className="glass-premium rounded-[3.5rem] hover-lift group relative overflow-hidden flex flex-col h-full transition-all duration-500 border border-border/50"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden">
                {post.image_url ? (
                  <Image 
                    src={post.image_url} 
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <ImageIcon size={48} strokeWidth={1} />
                  </div>
                )}
                <div className="absolute top-6 left-6">
                  <span className="px-5 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                    {post.categories?.name || 'Berita'}
                  </span>
                </div>
              </div>
              
              <div className="p-10 space-y-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-foreground/60 dark:text-muted-foreground font-bold text-xs uppercase tracking-widest">
                  <Calendar size={14} className="text-primary" />
                  {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </div>
                
                <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight">
                  {post.title}
                </h3>
                
                <p className="text-foreground/70 dark:text-muted-foreground line-clamp-3 text-base leading-relaxed font-medium">
                  Baca selengkapnya mengenai kontribusi dan dampak dari {post.title} bagi warga desa...
                </p>
                
                <div className="mt-auto pt-6 flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                  Selengkapnya <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

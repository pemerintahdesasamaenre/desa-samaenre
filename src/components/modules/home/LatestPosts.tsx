// src/components/modules/home/LatestPosts.tsx
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';

interface Post {
  title: string;
  slug: string;
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
              className="glass-premium p-1 p-10 rounded-[3.5rem] hover-lift group relative overflow-hidden flex flex-col justify-between h-full transition-all duration-500"
            >
              {/* Card visual highlight */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-5 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-primary/20">
                    {post.categories?.name || 'Berita'}
                  </span>
                  <div className="flex items-center gap-2 text-foreground/60 dark:text-muted-foreground font-bold text-xs uppercase tracking-widest">
                    <Calendar size={14} className="text-primary" />
                    {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                
                <h3 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors leading-[1.1] tracking-tight">
                  {post.title}
                </h3>
                
                <p className="text-foreground/70 dark:text-muted-foreground line-clamp-3 text-base leading-relaxed font-medium italic group-hover:text-foreground transition-colors">
                  &quot;Baca selengkapnya mengenai {post.title} untuk mendapatkan informasi lebih rinci dan mendalam...&quot;
                </p>
              </div>
              
              <div className="pt-10 flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                Selengkapnya <ChevronRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

// src/components/modules/home/LatestPosts.tsx
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';
import Image from 'next/image';

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

import { cn } from "@/lib/utils";

export default function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <section className="py-32 px-4 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-none">
              Kabar <br/>
              <span className="text-gradient">Terbaru Desa</span>
            </h2>
            <p className="text-foreground/80 font-medium max-w-xl text-xl leading-relaxed">
              Tetap terhubung dengan perkembangan terbaru, kegiatan, dan pengumuman resmi dari desa kami.
            </p>
          </div>
          <Link 
            href="/posts" 
            className="group flex items-center gap-3 bg-secondary/10 dark:bg-primary/10 border border-secondary/20 dark:border-primary/20 px-8 py-4 rounded-2xl font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-xl"
          >
            Lihat Semua Berita
            <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <div key={post.slug} className="w-full group/card">
              <Link href={`/posts/${post.slug}`}>
                <div
                  className={cn(
                    "cursor-pointer overflow-hidden relative card h-[450px] rounded-[2.5rem] shadow-xl max-w-sm mx-auto flex flex-col justify-between p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20"
                  )}
                >
                  {/* Background Image with Fallback */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={(!post.image_url || post.image_url.includes('placeholder-bg.jpg')) 
                        ? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80' 
                        : post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                    />
                    <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black/40 bg-black/20"></div>
                  </div>

                  
                  <div className="flex flex-row items-center space-x-4 z-10">
                    <div className="h-10 px-4 bg-primary text-primary-foreground flex items-center justify-center rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
                      {post.categories?.name || 'Berita'}
                    </div>
                  </div>

                  <div className="text content z-10 space-y-4">
                    <div className="flex items-center gap-2 text-white/70 font-bold text-xs uppercase tracking-widest">
                      <Calendar size={14} />
                      {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </div>
                    <h3 className="font-bold text-2xl md:text-3xl text-gray-50 relative leading-tight tracking-tight">
                      {post.title}
                    </h3>
                    <p className="font-medium text-sm text-gray-200 relative my-4 line-clamp-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                      Baca selengkapnya mengenai kontribusi dan dampak dari berita ini bagi warga desa...
                    </p>
                    <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                      Selengkapnya <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

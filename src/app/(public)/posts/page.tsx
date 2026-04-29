'use client';

import { getPosts } from '@/actions/posts'
import Link from 'next/link'
import { ChevronRight, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image';

type Post = Awaited<ReturnType<typeof getPosts>>[number];

export default function PublicPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts('published')
      setPosts(data)
      setLoading(false)
    }
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <header className="mb-20 space-y-6 text-center">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold uppercase tracking-widest">
              Warta Desa
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tighter">
              Kabar <span className="text-primary italic">Terkini</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              Ikuti berbagai kegiatan, pengumuman, dan berita terbaru seputar pembangunan dan aktivitas warga desa.
            </p>
          </header>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post) => (
                <div key={post.slug} className="w-full group/card">
                  <Link href={`/posts/${post.slug}`}>
                    <div className="cursor-pointer overflow-hidden relative card h-[450px] rounded-[3rem] shadow-xl max-w-sm mx-auto flex flex-col justify-between p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
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
                        <div className="absolute inset-0 transition duration-300 group-hover/card:bg-black/50 bg-black/30"></div>
                      </div>
                      
                      <div className="flex flex-row items-center space-x-4 z-10">
                        <div className="h-10 px-5 bg-primary text-primary-foreground flex items-center justify-center rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 shadow-lg">
                          {post.categories?.name || 'Berita'}
                        </div>
                      </div>

                      <div className="text content z-10 space-y-4">
                        <div className="flex items-center gap-2 text-white/80 font-bold text-xs uppercase tracking-widest">
                          <Calendar size={14} className="text-primary" />
                          {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <h2 className="font-bold text-2xl md:text-3xl text-gray-50 relative leading-[1.1] tracking-tight">
                          {post.title}
                        </h2>
                        <p className="font-medium text-sm text-gray-200 relative my-4 line-clamp-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                          {post.excerpt || 'Baca selengkapnya mengenai berita ini untuk mendapatkan rincian lebih lanjut bagi warga desa...'}
                        </p>
                        <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest pt-2">
                          Baca Selengkapnya <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border/50 rounded-[4rem] p-32 text-center space-y-6 shadow-xl">
              <h3 className="text-3xl font-bold text-foreground uppercase tracking-tighter">Belum ada berita.</h3>
              <p className="text-muted-foreground text-lg font-medium">Silakan kembali lagi nanti untuk informasi terbaru.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

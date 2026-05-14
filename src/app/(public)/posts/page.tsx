'use client';

import { getPosts, getCategories } from '@/actions/posts'
import Link from 'next/link'
import { ChevronRight, Calendar, Filter } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image';
import CustomSelect from '@/components/ui/CustomSelect'

type Post = Awaited<ReturnType<typeof getPosts>>[number];
type Category = { id: string, name: string };

export default function PublicPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [postsData, categoriesData] = await Promise.all([
        getPosts('published'),
        getCategories()
      ])
      setPosts(postsData)
      setCategories(categoriesData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category_id === selectedCategory)

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
          <header className="mb-12 space-y-6 text-center">
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

          <div className="max-w-xs mx-auto mb-16">
            <CustomSelect
              icon={Filter}
              placeholder="Filter Kategori"
              options={[
                { id: 'all', name: 'Semua Kategori' },
                ...categories
              ]}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPosts.map((post) => (
                <div key={post.slug} className="w-full group/card">
                  <Link href={`/posts/${post.slug}`}>
                    <div className="cursor-pointer overflow-hidden relative card h-[400px] rounded-3xl shadow-xl max-w-sm mx-auto flex flex-col justify-between p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={(!post.image_url || post.image_url.includes('placeholder-bg.jpg'))
                            ? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'
                            : post.image_url}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                        />
                        <div className="absolute inset-0 transition duration-300 group-hover/card:bg-black/60 bg-black/40"></div>
                      </div>

                      <div className="flex flex-row items-center space-x-4 z-10">
                        <div className="h-10 px-5 bg-primary text-primary-foreground flex items-center justify-center rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 shadow-lg">
                          {post.categories?.name || 'Berita'}
                        </div>
                      </div>

                      <div className="text content z-10 space-y-4">
                        <div className="flex items-center gap-2 text-white/80 font-bold text-xs uppercase tracking-widest">
                          <Calendar size={14} className="text-primary" />
                          {post.type === 'agenda' && post.event_date ? (
                            <span className="text-primary-foreground bg-primary/80 px-2 py-0.5 rounded-md mr-1">AGENDA</span>
                          ) : null}
                          {new Date(post.type === 'agenda' && post.event_date ? post.event_date : post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
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
            <div className="bg-card border border-border/50 rounded-3xl p-24 text-center space-y-6 shadow-xl">
              <h3 className="text-3xl font-bold text-foreground uppercase tracking-tighter">
                {selectedCategory === 'all' ? 'Belum ada berita.' : 'Tidak ada berita di kategori ini.'}
              </h3>
              <p className="text-muted-foreground text-lg font-medium">
                {selectedCategory === 'all'
                  ? 'Silakan kembali lagi nanti untuk informasi terbaru.'
                  : 'Cobalah memilih kategori lain atau kembali ke semua kategori.'}
              </p>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-all"
                >
                  Lihat Semua Berita
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

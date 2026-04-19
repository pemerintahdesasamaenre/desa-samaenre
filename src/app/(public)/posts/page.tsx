import Link from 'next/link'
import { Clock, ChevronRight } from 'lucide-react'
import { getPosts } from '@/actions/posts'
import Image from 'next/image'

export default async function PublicPostsPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 -skew-y-3 -translate-y-48"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <header className="mb-20 space-y-6 text-center">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold uppercase tracking-widest">
              Warta Desa
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter">
              Kabar <span className="text-primary italic">Terkini</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Ikuti berbagai kegiatan, pengumuman, dan berita terbaru seputar pembangunan dan aktivitas warga desa.
            </p>
          </header>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post) => (
                <Link 
                  key={post.slug} 
                  href={`/posts/${post.slug}`}
                  className="glass rounded-[3rem] overflow-hidden hover-lift group border border-transparent hover:border-primary/20 transition-all duration-500 flex flex-col h-full"
                >
                  {/* Thumbnail */}
                  <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                    {post.image_url ? (
                      <Image 
                        src={post.image_url} 
                        alt={post.title} 
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent group-hover:scale-110 transition-transform duration-700 flex items-center justify-center text-muted-foreground/20 italic font-black text-2xl rotate-12">
                        WARTA DESA
                      </div>
                    )}
                    <div className="absolute top-6 left-6 px-4 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                      {post.categories?.name || 'Berita'}
                    </div>
                  </div>

                  <div className="p-10 flex flex-col flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    <Clock size={12} />
                    {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h2 className="text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-3 font-light leading-relaxed flex-1">
                    {post.excerpt || 'Baca selengkapnya mengenai berita ini untuk mendapatkan rincian lebih lanjut...'}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-primary font-black text-sm group-hover:gap-4 transition-all uppercase tracking-widest">
                    Baca Selengkapnya
                    <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass rounded-[4rem] p-32 text-center space-y-6">
            <h3 className="text-3xl font-black text-foreground">Belum ada berita.</h3>
            <p className="text-muted-foreground text-lg">Silakan kembali lagi nanti untuk informasi terbaru.</p>
          </div>
        )}
      </div>
      </main>
    </div>
  )
}

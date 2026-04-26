'use client'

import { useState, useEffect, useCallback } from 'react'
import { getGalleryImages } from '@/actions/gallery'
import { GalleryImage } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, Calendar, ExternalLink, Loader2, ChevronDown } from 'lucide-react'

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchImages = useCallback(async (pageNum: number) => {
    try {
      const data = await getGalleryImages(pageNum, 12) // Slightly more per page for grid
      if (data.length < 12) {
        setHasMore(false)
      }
      
      if (pageNum === 1) {
        setImages(data)
      } else {
        setImages(prev => [...prev, ...data])
      }
    } catch (error) {
      console.error('Failed to fetch images:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (mounted) await fetchImages(1);
    };
    init();
    return () => { mounted = false; };
  }, [fetchImages])

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const nextPage = page + 1
    setPage(nextPage)
    fetchImages(nextPage)
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-48 flex flex-col items-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Memuat Galeri...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 overflow-hidden relative">
      {/* Background Decor - Simple CSS, no animations */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-full h-96 bg-primary/5 -rotate-3 -translate-y-48"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-20 text-center space-y-6">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-[0.2em]">
            Dokumentasi Visual
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-none uppercase">
            Galeri <span className="text-primary italic">Desa</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed italic">
            &quot;Mengabadikan setiap derap langkah pembangunan dan kehangatan kebersamaan warga Desa Samaenre.&quot;
          </p>
        </header>

        {images.length > 0 ? (
          <div className="space-y-20">
            {/* Mechanism: Standard Grid like Articles, but look is "Visual/Image" focused */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {images.map((img, idx) => (
                <div key={`${img.url}-${idx}`} className="group h-full">
                  <div className="bg-card h-full rounded-[2rem] overflow-hidden border border-border/60 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col">
                    {/* Image Section */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {img.url ? (
                        <Image 
                          src={img.url} 
                          alt={img.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-10 h-10 text-muted-foreground/20" />
                        </div>
                      )}
                      
                      {/* Source Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-background/90 backdrop-blur-sm border border-border/50 rounded-full text-[8px] font-black uppercase tracking-widest text-primary z-10">
                        {img.source === 'post' ? 'Warta Desa' : 'Profil Desa'}
                      </div>

                      {/* Link Overlay - Subtle */}
                      {img.link && (
                        <Link href={img.link} className="absolute inset-0 z-20 flex items-center justify-center bg-primary/0 group-hover:bg-primary/10 transition-all duration-300">
                           <div className="bg-background/90 p-3 rounded-full shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                             <ExternalLink size={18} className="text-primary" />
                           </div>
                        </Link>
                      )}
                    </div>

                    {/* Content Section - Cleaner than articles */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-base font-black text-foreground leading-tight line-clamp-2 mb-4 group-hover:text-primary transition-colors">
                        {img.title}
                      </h3>
                      
                      <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">
                          <Calendar size={12} className="text-primary/60" />
                          {new Date(img.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                        </div>
                        <div className="px-2 py-0.5 bg-muted rounded text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">
                          {img.source}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-10 py-4 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-primary hover:text-primary-foreground active:scale-95 disabled:opacity-30 flex items-center gap-3 shadow-lg"
                >
                  {loadingMore ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Jelajahi Lebih Banyak
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border border-dashed border-border rounded-[3rem] p-24 text-center space-y-4">
            <Camera size={48} className="mx-auto text-muted-foreground/20" />
            <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Koleksi Masih Kosong</h3>
            <p className="text-muted-foreground text-sm font-medium">Foto kegiatan akan muncul di sini segera setelah artikel dipublikasikan.</p>
          </div>
        )}
      </div>
    </main>
  )
}

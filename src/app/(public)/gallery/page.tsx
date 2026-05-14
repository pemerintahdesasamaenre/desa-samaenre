'use client'

import { useState, useEffect, useCallback } from 'react'
import { getGalleryImages } from '@/actions/gallery'
import { GalleryImage } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, Calendar, ExternalLink, Loader2, ChevronDown } from 'lucide-react'

function GalleryCard({ img }: { img: GalleryImage }) {
  return (
    <div className="cursor-pointer overflow-hidden relative card h-[400px] rounded-2xl shadow-xl max-w-sm mx-auto flex flex-col justify-between p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
      {/* Background Image with Fallback */}
      <div className="absolute inset-0 z-0">
        <Image
          src={img.url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'}
          alt={img.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover/card:scale-110"
        />
        <div className="absolute inset-0 transition duration-300 group-hover/card:bg-black/60 bg-black/40"></div>
      </div>
      
      <div className="flex flex-row items-center space-x-4 z-10">
        <div className="h-10 px-5 bg-primary text-primary-foreground flex items-center justify-center rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 shadow-lg">
          {img.source === 'post' ? 'Warta Desa' : 'Galeri'}
        </div>
      </div>

      <div className="text content z-10 space-y-4">
        <div className="flex items-center gap-2 text-white/80 font-bold text-xs uppercase tracking-widest">
          <Calendar size={14} className="text-primary" />
          {new Date(img.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <h2 className="font-bold text-xl md:text-2xl text-gray-50 relative leading-tight tracking-tight line-clamp-3">
          {img.title}
        </h2>
        {img.link && (
          <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest pt-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
            Lihat Detail <ExternalLink size={14} />
          </div>
        )}
      </div>
    </div>
  )
}

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
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold uppercase tracking-[0.2em]">
            Dokumentasi Visual
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-foreground tracking-tighter leading-none uppercase">
            Galeri <span className="text-primary italic">Desa</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed italic">
            &quot;Mengabadikan setiap derap langkah pembangunan dan kehangatan kebersamaan warga Desa Samaenre.&quot;
          </p>
        </header>

        {images.length > 0 ? (
          <div className="space-y-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {images.map((img, idx) => (
                <div key={`${img.url}-${idx}`} className="w-full group/card">
                  {img.link ? (
                    <Link href={img.link}>
                      <GalleryCard img={img} />
                    </Link>
                  ) : (
                    <GalleryCard img={img} />
                  )}
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-10 py-4 bg-foreground text-background rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all hover:bg-primary hover:text-primary-foreground active:scale-95 disabled:opacity-30 flex items-center gap-3 shadow-lg"
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
          <div className="bg-card border border-dashed border-border rounded-2xl p-24 text-center space-y-4">
            <Camera size={48} className="mx-auto text-muted-foreground/20" />
            <h3 className="text-2xl font-bold text-foreground uppercase tracking-tight">Koleksi Masih Kosong</h3>
            <p className="text-muted-foreground text-sm font-medium">Foto kegiatan akan muncul di sini segera setelah artikel dipublikasikan.</p>
          </div>
        )}
      </div>
    </main>
  )
}

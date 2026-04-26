'use client'

import { useState, useEffect, useCallback } from 'react'
import { getGalleryImages } from '@/actions/gallery'
import { GalleryImage } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, Calendar, Tag, ExternalLink, Loader2, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchImages = useCallback(async (pageNum: number) => {
    try {
      const data = await getGalleryImages(pageNum, 9)
      if (data.length < 9) {
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
        <p className="text-muted-foreground font-medium animate-pulse text-sm uppercase tracking-widest">Memuat Galeri...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 overflow-hidden relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-96 bg-primary/5 skew-y-3 -translate-y-48"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-20 text-center space-y-6">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold uppercase tracking-widest">
            Dokumentasi Visual
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-none">
            Galeri <span className="text-primary italic">Desa</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Koleksi foto kegiatan dan pembangunan yang terhubung langsung dengan warta desa kami.
          </p>
        </header>

        {images.length > 0 ? (
          <div className="space-y-16">
            {/* Grid Layout - More performant than columns/masonry */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {images.map((img, idx) => (
                <motion.div
                  key={`${img.url}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                  className="group"
                >
                  <div className="bg-card rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border border-border/50">
                    <div className="relative h-64 sm:h-72 overflow-hidden bg-muted">
                      {img.url ? (
                        <Image 
                          src={img.url} 
                          alt={img.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                          <Camera size={40} className="text-muted-foreground/20" />
                        </div>
                      )}
                      
                      <div className="absolute top-6 left-6 px-4 py-1.5 bg-background/90 backdrop-blur-md border border-border rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-lg z-10">
                        {img.source === 'post' ? 'Berita' : 'Branding'}
                      </div>
                      
                      {img.link && (
                        <Link href={img.link} className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white scale-75 group-hover:scale-100 transition-transform duration-500 border border-white/30 shadow-2xl">
                            <ExternalLink size={24} />
                          </div>
                        </Link>
                      )}
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                      <h3 className="text-xl font-black text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {img.title}
                      </h3>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-border/50">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                          <Calendar size={12} className="text-primary" />
                          {new Date(img.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">
                          <Tag size={10} className="text-primary" />
                          {img.source}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="group relative px-12 py-5 bg-primary text-primary-foreground rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-primary/20"
                >
                  {loadingMore ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Muat Lebih Banyak
                      <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border/50 rounded-[4rem] p-32 text-center space-y-6 shadow-xl">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Camera size={48} className="text-primary/40" />
            </div>
            <h3 className="text-3xl font-black text-foreground tracking-tight uppercase">Belum ada koleksi foto.</h3>
            <p className="text-muted-foreground text-lg font-medium max-w-md mx-auto">
              Semua foto yang diunggah melalui berita atau profil desa akan muncul secara otomatis di sini.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

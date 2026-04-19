import { getAllVillageImages } from '@/services/data-service'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, Calendar, Tag, ExternalLink } from 'lucide-react'

export const metadata = {
  title: 'Galeri Foto - Desa Samaenre',
  description: 'Koleksi dokumentasi kegiatan, infrastruktur, dan momen penting Desa Samaenre.',
}

export default async function GalleryPage() {
  const images = await getAllVillageImages()

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute top-0 right-0 w-full h-96 bg-primary/5 skew-y-3 -translate-y-48"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
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
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {images.map((img, idx) => {
              const CardContent = (
                <div className="break-inside-avoid glass rounded-[2.5rem] overflow-hidden hover-lift group border border-transparent hover:border-primary/20 transition-all duration-500 cursor-pointer">
                  <div className="relative overflow-hidden bg-muted">
                    <Image 
                      src={img.url} 
                      alt={img.title}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-background/80 backdrop-blur-md border border-border rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-lg">
                      {img.source === 'post' ? 'Berita' : 'Identitas'}
                    </div>
                    {img.link && (
                      <div className="absolute bottom-6 right-6 p-3 bg-primary text-white rounded-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl">
                        <ExternalLink size={20} />
                      </div>
                    )}
                  </div>
                  <div className="p-8 space-y-4">
                    <h3 className="text-lg font-black text-foreground leading-tight group-hover:text-primary transition-colors">
                      {img.title}
                    </h3>
                    <div className="flex items-center justify-between pt-4 border-t border-border opacity-60">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                        <Calendar size={12} className="text-primary" />
                        {new Date(img.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                        <Tag size={12} className="text-primary" />
                        {img.source}
                      </div>
                    </div>
                  </div>
                </div>
              )

              return img.link ? (
                <Link key={idx} href={img.link}>
                  {CardContent}
                </Link>
              ) : (
                <div key={idx}>{CardContent}</div>
              )
            })}
          </div>
        ) : (
          <div className="glass rounded-[4rem] p-32 text-center space-y-6">
            <Camera size={64} className="mx-auto text-primary/20" />
            <h3 className="text-3xl font-black text-foreground tracking-tight">Belum ada koleksi foto.</h3>
            <p className="text-muted-foreground text-lg">Semua foto yang diunggah melalui berita atau profil akan muncul di sini.</p>
          </div>
        )}
      </div>
    </main>
  )
}

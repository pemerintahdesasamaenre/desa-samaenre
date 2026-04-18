import { getPostBySlug } from '@/actions/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, ChevronLeft, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post || post.status !== 'published') {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          {/* Cover Image */}
          <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
            {post.image_url ? (
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                <Calendar size={64} />
              </div>
            )}
            <div className="absolute top-8 left-8">
              <Link 
                href="/posts"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md text-slate-900 rounded-2xl text-sm font-bold shadow-xl hover:bg-white transition-all hover:scale-105 active:scale-95"
              >
                <ChevronLeft size={16} />
                Kembali
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 space-y-10">
            {/* Post Meta */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4 items-center">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                  post.type === 'news' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-purple-600 text-white'
                }`}>
                  {post.type === 'news' ? 'Berita' : 'Agenda'}
                </span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Calendar size={16} className="text-blue-500" />
                  <span>{new Date(post.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Clock size={16} className="text-blue-500" />
                  <span>5 menit baca</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-4 py-6 border-y border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {post.author_id?.slice(0, 1) || 'A'}
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Ditulis oleh</p>
                  <p className="font-bold text-slate-900 dark:text-white">Admin Desa</p>
                </div>
              </div>
            </div>

            {/* Event Info if Agenda */}
            {post.type === 'agenda' && post.event_date && (
              <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/20 flex flex-col md:flex-row gap-6 items-center">
                <div className="p-4 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-500/20">
                  <Calendar size={32} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-purple-600 dark:text-purple-400 font-bold text-sm uppercase tracking-widest">Detail Agenda</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {new Date(post.event_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-purple-500/20 active:scale-95">
                  Ingatkan Saya
                </button>
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700">
              {post.content.split('\n').map((para: string, i: number) => (
                para ? <p key={i}>{para}</p> : <br key={i} />
              ))}
            </div>

            {/* Footer / Sharing */}
            <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Bagikan:</span>
                <div className="flex gap-2">
                  <button className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all hover:scale-110">
                    <Facebook size={20} />
                  </button>
                  <button className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-blue-400 hover:text-white transition-all hover:scale-110">
                    <Twitter size={20} />
                  </button>
                  <button className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-green-500 hover:text-white transition-all hover:scale-110">
                    <MessageCircle size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-500 text-sm font-medium">
                <Share2 size={16} />
                <span>Salin Tautan</span>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

import Link from 'next/link'
import { Calendar, Clock, ChevronRight, FileText } from 'lucide-react'
import { getPosts } from '@/actions/posts'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default async function PublicPostsPage() {
  const posts = await getPosts('published')

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Berita & Agenda Desa
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Ikuti perkembangan terbaru dan kegiatan yang akan datang di desa kami.
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length === 0 ? (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <FileText size={32} />
                </div>
                <p className="text-slate-500 text-lg">Belum ada berita atau agenda yang diterbitkan.</p>
              </div>
            ) : (
              posts.map((post) => (
                <article 
                  key={post.id} 
                  className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-800 flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {post.image_url ? (
                      <img 
                        src={post.image_url} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                        <FileText size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                        post.type === 'news' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-purple-600 text-white'
                      }`}>
                        {post.type === 'news' ? 'Berita' : 'Agenda'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col space-y-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(post.created_at).toLocaleDateString('id-ID')}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>5 mnt baca</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 flex-1 leading-relaxed">
                      {post.content}
                    </p>

                    <Link 
                      href={`/posts/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group/link"
                    >
                      Baca Selengkapnya
                      <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

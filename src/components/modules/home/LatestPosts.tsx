// src/components/modules/home/LatestPosts.tsx
import Link from 'next/link';

interface Post {
  title: string;
  slug: string;
  created_at: string;
  categories: { name: string } | null;
}

interface LatestPostsProps {
  posts: Post[];
}

export default function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Informasi Terkini</h2>
        <Link href="/posts" className="font-semibold text-blue-600 hover:underline">
          Lihat Semua Berita &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`} className="block bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
            {/* Placeholder for image */}
            <div className="h-40 bg-slate-200 dark:bg-slate-700"></div>
            <div className="p-6">
              <p className="text-sm font-semibold text-blue-600">{post.categories?.name || 'Umum'}</p>
              <h3 className="mt-2 text-xl font-bold">{post.title}</h3>
              <p className="mt-4 text-sm text-slate-500">{new Date(post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

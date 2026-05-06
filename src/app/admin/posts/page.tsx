import { getPosts } from '@/actions/posts';
import Link from 'next/link';
import { Plus, FileText } from 'lucide-react';
import { PostTable } from '@/components/modules/posts/PostTable';
import { Post } from '@/types';

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 sm:p-2.5 bg-muted rounded-xl border border-border flex items-center justify-center text-primary shrink-0">
             <FileText size={20} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Berita & Agenda</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">Kelola publikasi informasi dan agenda kegiatan desa.</p>
          </div>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl sm:rounded-full transition-all shadow-lg shadow-primary/20 font-bold uppercase text-[10px] sm:text-xs tracking-widest active:scale-95 w-full lg:w-auto"
        >
          <Plus size={16} />
          Post Baru
        </Link>
      </div>

      <PostTable posts={posts as Post[]} isLoading={false} />
    </div>
  );
}

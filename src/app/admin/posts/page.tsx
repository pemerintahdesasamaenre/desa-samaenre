'use client';

import { useState, useEffect } from 'react';
import { getPosts } from '@/actions/posts';
import Link from 'next/link';
import { Plus, Loader2 } from 'lucide-react';
import { PostTableRow } from '@/components/modules/posts/table/PostTableRow';
import { Post } from '@/types';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await getPosts();
      setPosts(data as Post[]);
      setLoading(false);
    }
    loadData();
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 sm:p-2.5 bg-muted rounded-xl border border-border flex items-center justify-center text-primary shrink-0">
             <Plus size={20} /> {/* Should be FileText or similar but for now consistency in layout */}
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

      <div className="bg-card border border-border rounded-xl sm:rounded-3xl overflow-hidden shadow-sm w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {/* Kolom 1: Toggle (Mobile Only) */}
                <th className="md:hidden w-10 px-3 py-4"></th>
                
                {/* Kolom 2: Konten (Main) */}
                <th className="px-3 sm:px-8 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider">Konten</th>
                
                {/* Kolom 3-5: Desktop Only */}
                <th className="hidden md:table-cell px-8 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider w-32">Kategori</th>
                <th className="hidden lg:table-cell px-8 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider w-24 text-center">Views</th>
                <th className="hidden md:table-cell px-8 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider w-32">Status</th>
                
                {/* Kolom 6: Aksi (Desktop Only) */}
                <th className="hidden md:table-cell px-3 sm:px-8 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider text-right w-44">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary mb-3" size={20} />
                    <p className="text-muted-foreground font-bold uppercase text-[9px] tracking-widest text-center">Memuat...</p>
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground font-medium italic text-sm">
                    Data kosong.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <PostTableRow 
                    key={post.id}
                    post={post}
                    isExpanded={expandedRows.includes(post.id)}
                    onToggleExpand={() => toggleRow(post.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

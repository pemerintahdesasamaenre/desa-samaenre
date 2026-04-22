'use client';

import React, { useState, useEffect } from 'react';
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
    <div className="space-y-4 sm:space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-4 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-border shadow-sm">
        <div>
          <h1 className="text-xl sm:text-4xl font-black text-foreground tracking-tighter uppercase">Berita & Agenda</h1>
          <p className="text-[10px] sm:text-base text-muted-foreground mt-1 font-medium italic">
            Kelola publikasi informasi dan agenda kegiatan desa.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg sm:rounded-full font-black transition-all shadow-xl shadow-primary/25 w-full lg:w-auto uppercase text-[10px] sm:text-xs tracking-widest active:scale-95"
        >
          <Plus size={16} />
          Post Baru
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl sm:rounded-[3rem] overflow-hidden shadow-sm w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {/* Kolom 1: Toggle (Mobile Only) */}
                <th className="md:hidden w-10 px-3 py-4"></th>
                
                {/* Kolom 2: Konten (Main) */}
                <th className="px-3 sm:px-8 py-4 text-[8px] sm:text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Konten</th>
                
                {/* Kolom 3-5: Desktop Only */}
                <th className="hidden md:table-cell px-8 py-4 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] w-32">Kategori</th>
                <th className="hidden lg:table-cell px-8 py-4 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] w-24 text-center">Views</th>
                <th className="hidden md:table-cell px-8 py-4 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] w-32">Status</th>
                
                {/* Kolom 6: Aksi (Desktop Only) */}
                <th className="hidden md:table-cell px-3 sm:px-8 py-4 text-[8px] sm:text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] text-right w-44">Aksi</th>
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

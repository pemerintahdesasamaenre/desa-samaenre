'use client';

import { useState } from 'react';
import { PostTableRow } from '@/components/modules/posts/table/PostTableRow';
import { Post } from '@/types';

interface PostTableProps {
  posts: Post[];
}

export const PostTable = ({ posts }: PostTableProps) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-card border border-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm w-full">
      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full text-left border-collapse table-auto sm:table-fixed">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="md:hidden w-8 px-2 py-4"></th>
              <th className="px-4 sm:px-6 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider w-auto">Konten</th>
              <th className="hidden md:table-cell px-6 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider w-1/4">Kategori</th>
              <th className="hidden lg:table-cell px-6 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider w-1/6">Pelihat</th>
              <th className="hidden md:table-cell px-6 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider w-1/6">Status</th>
              <th className="px-4 sm:px-6 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider text-right w-20 sm:w-40">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.length === 0 ? (
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
  );
};

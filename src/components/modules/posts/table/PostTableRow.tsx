'use client';

import Link from 'next/link';
import { Edit2, ChevronDown, ChevronUp, Clock, ExternalLink } from 'lucide-react';
import DeletePostButton from '@/components/modules/posts/DeletePostButton';

interface PostTableRowProps {
  post: {
    id: string;
    title: string;
    slug: string;
    created_at: string;
    type: 'news' | 'agenda';
    status: 'draft' | 'published';
    views: number;
    categories?: { name: string } | null;
  };
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const PostTableRow = ({ post, isExpanded, onToggleExpand }: PostTableRowProps) => {
  return (
    <>
      <tr 
        className="hover:bg-primary/5 transition-colors group border-b border-border last:border-0 cursor-pointer md:cursor-default"
        onClick={() => { if (window.innerWidth < 768) onToggleExpand(); }}
      >
        {/* Kolom 1: Toggle (Hanya Mobile) */}
        <td className="md:hidden px-3 py-4 text-center">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </td>

        {/* Kolom 2: Konten (Selalu Muncul) */}
        <td className="px-3 sm:px-8 py-4">
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-foreground text-sm sm:text-base tracking-tight leading-tight">
              {post.title}
            </span>
            <span className="md:hidden text-[8px] text-muted-foreground mt-1 font-bold uppercase tracking-widest truncate">
              {post.categories?.name || 'Umum'} • {post.type}
            </span>
          </div>
        </td>

        {/* Kolom 3-5: Desktop Only */}
        <td className="hidden md:table-cell px-8 py-4">
          <span className="px-2 py-0.5 bg-muted rounded text-[9px] font-bold uppercase tracking-widest text-muted-foreground border border-border/50">
            {post.categories?.name || 'Umum'}
          </span>
        </td>
        <td className="hidden lg:table-cell px-8 py-4 text-center">
          <span className="text-foreground font-bold text-xs tabular-nums">{post.views}</span>
        </td>
        <td className="hidden md:table-cell px-8 py-4 text-center">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
            post.status === 'published' ? 'text-primary border-primary/20 bg-primary/10' : 'text-muted-foreground border-border bg-muted/30'
          }`}>
            {post.status.toUpperCase()}
          </span>
        </td>

        {/* Kolom 6: Aksi (Desktop Only) */}
        <td className="hidden md:table-cell px-3 sm:px-8 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <Link href={`/posts/${post.slug}`} target="_blank" className="p-2 text-muted-foreground hover:text-primary bg-muted/50 rounded-lg transition-all" title="Lihat"><ExternalLink size={14} /></Link>
            <Link href={`/admin/posts/edit/${post.id}`} className="p-2 text-muted-foreground hover:text-primary bg-muted/50 rounded-lg transition-all" title="Edit"><Edit2 size={14} /></Link>
            <DeletePostButton id={post.id} title={post.title} />
          </div>
        </td>
      </tr>
      
      {isExpanded && (
        <tr className="md:hidden bg-muted/5 animate-in slide-in-from-top-1 duration-200">
          <td colSpan={6} className="px-4 py-5 border-l-4 border-primary">
            <div className="space-y-5">
              {/* Statistik Mobile */}
              <div className="flex items-center justify-between bg-background/50 p-3 rounded-xl border border-border/50">
                <div className="flex items-center gap-3">
                  <Clock size={12} className="text-primary" />
                  <div>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Publikasi</p>
                    <p className="text-[10px] font-bold text-foreground">{new Date(post.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Status</p>
                  <p className={`text-[9px] font-bold uppercase ${post.status === 'published' ? 'text-primary' : 'text-muted-foreground'}`}>{post.status}</p>
                </div>
              </div>

              {/* Action Buttons for Mobile */}
              <div className="flex flex-col gap-2 pt-2">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Opsi Pengelolaan</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    href={`/posts/${post.slug}`} 
                    target="_blank" 
                    className="flex items-center justify-center gap-2 bg-background border border-border text-foreground py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest active:scale-95"
                  >
                    <ExternalLink size={14} className="text-primary" />
                    Buka
                  </Link>
                  <Link 
                    href={`/admin/posts/edit/${post.id}`} 
                    className="flex items-center justify-center gap-2 bg-background border border-border text-foreground py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest active:scale-95"
                  >
                    <Edit2 size={14} className="text-primary" />
                    Edit
                  </Link>
                </div>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

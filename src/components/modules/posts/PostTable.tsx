'use client';

import { Post } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';
import Link from 'next/link';
import { Edit2, ExternalLink, Clock } from 'lucide-react';
import DeletePostButton from '@/components/modules/posts/DeletePostButton';

interface PostTableProps {
  posts: Post[];
  isLoading?: boolean;
}

export const PostTable = ({ posts, isLoading }: PostTableProps) => {
  const columns: Column<Post>[] = [
    {
      header: 'Konten',
      accessor: (post) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-foreground text-sm sm:text-base tracking-tight leading-tight">
            {post.title}
          </span>
          <span className="md:hidden text-[8px] text-muted-foreground mt-1 font-bold uppercase tracking-widest truncate">
            {post.categories?.name || 'Umum'} • {post.type}
          </span>
        </div>
      ),
    },
    {
      header: 'Kategori',
      hideOnMobile: true,
      accessor: (post) => (
        <span className="px-2 py-0.5 bg-muted rounded text-[9px] font-bold uppercase tracking-widest text-muted-foreground border border-border/50">
          {post.categories?.name || 'Umum'}
        </span>
      ),
    },
    {
      header: 'Pelihat',
      hideOnMobile: true,
      hideOnTablet: true,
      align: 'center',
      accessor: (post) => (
        <span className="text-foreground font-bold text-xs tabular-nums">{post.views}</span>
      ),
    },
    {
      header: 'Status',
      hideOnMobile: true,
      align: 'center',
      accessor: (post) => (
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
          post.status === 'published' ? 'text-primary border-primary/20 bg-primary/10' : 'text-muted-foreground border-border bg-muted/30'
        }`}>
          {post.status.toUpperCase()}
        </span>
      ),
    },
    {
      header: 'Aksi',
      align: 'right',
      accessor: (post) => (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/posts/${post.slug}`} target="_blank" className="p-2 text-muted-foreground hover:text-primary bg-muted/50 rounded-lg transition-all" title="Lihat"><ExternalLink size={14} /></Link>
          <Link href={`/admin/posts/edit/${post.id}`} className="p-2 text-muted-foreground hover:text-primary bg-muted/50 rounded-lg transition-all" title="Edit"><Edit2 size={14} /></Link>
          <DeletePostButton id={post.id} title={post.title} />
        </div>
      ),
    },
  ];

  const renderExpandedRow = (post: Post) => (
    <div className="space-y-5">
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
  );

  return (
    <DataTable
      data={posts}
      columns={columns}
      keyExtractor={(post) => post.id}
      renderExpandedRow={renderExpandedRow}
      isLoading={isLoading}
      emptyState={
        <div className="py-20 text-center text-muted-foreground font-medium italic text-sm">
          Data kosong.
        </div>
      }
    />
  );
};

import { getCategories } from '@/services/data-service'
import Link from 'next/link'
import { Plus, Edit2, Folder, ListTree } from 'lucide-react'
import DeleteCategoryButton from '@/components/modules/categories/DeleteCategoryButton'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 sm:p-2.5 bg-muted rounded-xl border border-border flex items-center justify-center text-primary shrink-0">
             <Folder size={20} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Kategori Konten</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">Kelola pengelompokan berita, statistik, dan galeri.</p>
          </div>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl sm:rounded-full font-bold transition-all shadow-lg shadow-primary/25 w-full lg:w-auto uppercase text-[10px] sm:text-xs tracking-widest hover:opacity-90 active:scale-95"
        >
          <Plus size={16} />
          Tambah Kategori
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            className="group bg-card p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col"
          >
            <div className="flex items-start justify-between mb-6 sm:mb-8">
              <div className="p-3 sm:p-4 bg-primary/10 text-primary rounded-xl sm:rounded-2xl border border-primary/10">
                <Folder size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  href={`/admin/categories/edit/${cat.id}`}
                  className="p-2 sm:p-3 text-muted-foreground hover:text-primary bg-muted/50 rounded-lg sm:rounded-xl transition-all"
                >
                  <Edit2 size={16} />
                </Link>
                <DeleteCategoryButton id={cat.id} name={cat.name} />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2 tracking-tight group-hover:text-primary transition-colors truncate">{cat.name}</h3>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span className="text-xs font-bold text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-widest">
                  {cat.type}
                </span>
              </div>
              {cat.description && (
                <p className="text-[10px] sm:text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed italic">
                  &quot;{cat.description}&quot;
                </p>
              )}
            </div>
            
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-widest opacity-40">
              ID: {cat.id.slice(0, 8)}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="p-12 sm:p-16 text-center bg-card rounded-2xl sm:rounded-3xl border border-dashed border-border">
          <ListTree size={32} className="mx-auto mb-4 text-muted-foreground/30 sm:w-12 sm:h-12" />
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] sm:text-xs">Belum ada kategori.</p>
        </div>
      )}
    </div>
  )
}

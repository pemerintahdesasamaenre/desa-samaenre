import { getCategories } from '@/services/data-service'
import Link from 'next/link'
import { Plus, Edit2, Folder, ListTree } from 'lucide-react'
import DeleteCategoryButton from '@/components/modules/categories/DeleteCategoryButton'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-10 pb-20 px-4 md:px-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground tracking-tighter">Manajemen Kategori</h1>
          <p className="text-muted-foreground mt-2 font-medium italic">
            Kelola pengelompokan konten berita, statistik, dan galeri desa.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-black transition-all shadow-xl shadow-primary/25 w-full lg:w-auto uppercase text-xs tracking-widest hover:opacity-90 active:scale-95"
        >
          <Plus size={20} />
          Tambah Kategori
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            className="group bg-card p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="p-4 bg-primary/10 text-primary rounded-2xl border border-primary/10">
                <Folder size={24} />
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/categories/edit/${cat.id}`}
                  className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all border border-transparent hover:border-primary/20"
                >
                  <Edit2 size={18} />
                </Link>
                <DeleteCategoryButton id={cat.id} name={cat.name} />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-black text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">{cat.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black text-primary bg-primary/5 border border-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                  {cat.type}
                </span>
              </div>
              {cat.description && (
                <p className="text-sm text-muted-foreground font-medium line-clamp-3 leading-relaxed italic">
                  &quot;{cat.description}&quot;
                </p>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-border text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-widest opacity-40">
              UID: {cat.id.slice(0, 8)}...
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="p-24 text-center bg-card rounded-[3rem] border border-dashed border-border">
          <ListTree size={48} className="mx-auto mb-6 text-muted-foreground/30" />
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Belum ada kategori tersedia.</p>
        </div>
      )}
    </div>
  )
}

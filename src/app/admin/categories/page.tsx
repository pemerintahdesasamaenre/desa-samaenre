import { getCategories } from '@/services/data-service'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Folder } from 'lucide-react'
import DeleteCategoryButton from '@/components/modules/categories/DeleteCategoryButton'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Kategori</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Kelola kategori untuk berita, statistik, dan konten lainnya.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 w-full md:w-auto"
        >
          <Plus size={20} />
          Tambah Kategori
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat: any) => (
          <div 
            key={cat.id}
            className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <Folder size={24} />
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/categories/edit/${cat.id}`}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                >
                  <Edit2 size={18} />
                </Link>
                <DeleteCategoryButton id={cat.id} name={cat.name} />
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{cat.name}</h3>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              Tipe: {cat.type}
            </p>
            {cat.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {cat.description}
              </p>
            )}
            
            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
              ID: {cat.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

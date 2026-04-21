import { getCategories } from '@/services/data-service'
import Link from 'next/link'
import { Plus, Edit2, Folder, ListTree } from 'lucide-react'
import DeleteCategoryButton from '@/components/modules/categories/DeleteCategoryButton'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Manajemen Kategori</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">
            Kelola pengelompokan konten berita dan statistik.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 w-full sm:w-auto text-sm md:text-base"
        >
          <Plus size={20} />
          Tambah Kategori
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            className="group bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <Folder size={20} className="md:hidden" />
                <Folder size={24} className="hidden md:block" />
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/categories/edit/${cat.id}`}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                >
                  <Edit2 size={16} className="md:hidden" />
                  <Edit2 size={18} className="hidden md:block" />
                </Link>
                <DeleteCategoryButton id={cat.id} name={cat.name} />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1">{cat.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded uppercase tracking-wider">
                  {cat.type}
                </span>
              </div>
              {cat.description && (
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {cat.description}
                </p>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 text-[9px] md:text-[10px] text-slate-400 font-mono truncate">
              ID: {cat.id}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <ListTree size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500">Belum ada kategori yang ditambahkan.</p>
        </div>
      )}
    </div>
  )
}

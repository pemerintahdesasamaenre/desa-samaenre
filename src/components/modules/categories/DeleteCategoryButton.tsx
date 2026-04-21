'use client'

import { useState } from 'react'
import { deleteCategory } from '@/actions/categories'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"? Postingan yang menggunakan kategori ini mungkin terpengaruh.`)) {
      return
    }

    setLoading(true)
    try {
      const result = await deleteCategory(id)
      if (result.error) {
        alert('Gagal menghapus: ' + result.error)
      } else {
        router.refresh()
      }
    } catch {
      alert('Terjadi kesalahan sistem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
    </button>
  )
}

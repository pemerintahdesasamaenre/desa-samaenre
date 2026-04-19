'use client'

import { useState } from 'react'
import { deletePost } from '@/actions/posts'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus postingan "${title}"?`)) {
      return
    }

    setLoading(true)
    try {
      const result = await deletePost(id)
      if (result.error) {
        alert('Gagal menghapus: ' + result.error)
      } else {
        router.refresh()
      }
    } catch (err) {
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
      title="Hapus"
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
    </button>
  )
}

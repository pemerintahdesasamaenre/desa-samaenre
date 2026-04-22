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
      className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all border border-transparent hover:border-destructive/20"
      title="Hapus"
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
    </button>
  )
}

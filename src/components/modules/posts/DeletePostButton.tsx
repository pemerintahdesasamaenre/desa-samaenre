'use client'

import { useState } from 'react'
import { deletePost } from '@/actions/posts'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { toast } from 'sonner'

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    const toastId = toast.loading(`Menghapus "${title}"...`)
    try {
      const result = await deletePost(id)
      if (result.error) {
        toast.error('Gagal menghapus: ' + result.error, { id: toastId })
      } else {
        toast.success(`"${title}" berhasil dihapus`, { id: toastId })
        setShowConfirm(false)
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan sistem', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all border border-transparent hover:border-destructive/20"
        title="Hapus"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
      </button>

      <ConfirmDialog 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Hapus Postingan?"
        description={`Apakah Anda yakin ingin menghapus "${title}"? Tindakan ini tidak dapat dibatalkan.`}
        variant="danger"
        confirmLabel="Ya, Hapus Postingan"
        loading={loading}
      />
    </>
  )
}

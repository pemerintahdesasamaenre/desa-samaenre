'use client'

import { useState } from 'react'
import { deleteCategory } from '@/actions/categories'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { toast } from 'sonner'

export default function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    const toastId = toast.loading(`Menghapus kategori "${name}"...`)
    try {
      const result = await deleteCategory(id)
      if (result.error) {
        toast.error('Gagal menghapus: ' + result.error, { id: toastId })
      } else {
        toast.success(`Kategori "${name}" berhasil dihapus`, { id: toastId })
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
        title="Hapus Kategori?"
        description={`Apakah Anda yakin ingin menghapus kategori "${name}"? Seluruh data yang terhubung dengan kategori ini mungkin akan terpengaruh.`}
        variant="danger"
        confirmLabel="Ya, Hapus Kategori"
        loading={loading}
      />
    </>
  )
}

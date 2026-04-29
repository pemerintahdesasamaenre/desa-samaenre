'use client'

import { useState } from 'react'
import { deleteFinanceEntry } from '@/actions/finances'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { toast } from 'sonner'

export default function DeleteFinanceButton({ id, category }: { id: string; category: string }) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    const toastId = toast.loading(`Menghapus data anggaran "${category}"...`)
    try {
      const result = await deleteFinanceEntry(id)
      if (result.error) {
        toast.error('Gagal menghapus: ' + result.error, { id: toastId })
      } else {
        toast.success(`Data "${category}" berhasil dihapus`, { id: toastId })
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
        title="Hapus Data Anggaran?"
        description={`Apakah Anda yakin ingin menghapus data anggaran "${category}"? Record ini akan hilang dari laporan transparansi.`}
        variant="danger"
        confirmLabel="Ya, Hapus Data"
        loading={loading}
      />
    </>
  )
}

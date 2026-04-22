'use client'

import { useState } from 'react'
import { deleteFinanceEntry } from '@/actions/finances'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

export default function DeleteFinanceButton({ id, category }: { id: string; category: string }) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteFinanceEntry(id)
      if (result.error) {
        alert('Gagal menghapus: ' + result.error)
      } else {
        setShowConfirm(false)
        router.refresh()
      }
    } catch {
      alert('Terjadi kesalahan sistem')
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

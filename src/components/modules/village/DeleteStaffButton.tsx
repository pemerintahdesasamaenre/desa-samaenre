'use client'

import { useState } from 'react'
import { deleteStaffMember } from '@/actions/staff'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

export default function DeleteStaffButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteStaffMember(id)
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
        title="Hapus Data Aparatur?"
        description={`Apakah Anda yakin ingin menghapus "${name}" dari struktur organisasi desa?`}
        variant="danger"
        confirmLabel="Ya, Hapus Aparatur"
        loading={loading}
      />
    </>
  )
}

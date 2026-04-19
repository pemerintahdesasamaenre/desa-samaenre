'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { uploadImage } from '@/lib/supabase/storage'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  folder: string
  label?: string
}

export default function ImageUpload({ value, onChange, folder, label = "Gambar" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setUploading(true)

    try {
      const publicUrl = await uploadImage(file, folder)
      onChange(publicUrl)
    } catch (error: any) {
      alert('Gagal mengunggah gambar: ' + error.message)
      setPreview(value || null) // Revert to previous value on error
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      
      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          relative h-48 w-full rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden
          ${preview ? 'border-blue-500 bg-blue-50/5 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900'}
        `}
      >
        {preview ? (
          <>
            <img 
              src={preview} 
              alt="Preview" 
              className={`h-full w-full object-cover transition-opacity duration-300 ${uploading ? 'opacity-40' : 'opacity-100'}`}
            />
            {!uploading && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <Upload size={24} className="text-blue-500" />
            </div>
            <p className="text-xs font-medium">Klik untuk unggah gambar</p>
            <p className="text-[10px] opacity-50">PNG, JPG atau WEBP (Maks. 2MB)</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px]">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Mengunggah...</p>
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}

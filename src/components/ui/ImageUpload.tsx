'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { uploadImage } from '@/lib/supabase/storage'

interface ImageUploadProps {
  value?: string | null
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

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setUploading(true)

    try {
      const publicUrl = await uploadImage(file, folder)
      onChange(publicUrl)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      alert('Gagal mengunggah gambar: ' + message)
      setPreview(value || null)
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
      <label className="text-sm font-semibold text-foreground/70">
        {label}
      </label>
      
      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          relative h-48 w-full rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden
          ${preview ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:bg-muted/50'}
        `}
      >
        {preview ? (
          <>
            <Image 
              src={preview} 
              alt="Preview" 
              fill
              className={`object-cover transition-opacity duration-300 ${uploading ? 'opacity-40' : 'opacity-100'}`}
            />
            {!uploading && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 shadow-lg transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center text-muted-foreground">
            <div className="p-4 bg-background rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform border border-border">
              <Upload size={24} className="text-primary" />
            </div>
            <p className="text-xs font-medium">Klik untuk unggah gambar</p>
            <p className="text-[10px] opacity-50 uppercase tracking-widest font-bold">Maks. 2MB</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[2px]">
            <Loader2 className="animate-spin text-primary mb-2" size={32} />
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Mengunggah...</p>
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

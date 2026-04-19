import { createClient } from './client'
import { createClient as createServerClient } from './server'

export const BUCKET_NAME = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'village-assets'

export async function uploadImage(file: File, folder: string) {
  const supabase = createClient()
  
  // Buat nama file unik: folder/timestamp-random.ext
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  // Ambil URL Publik
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return publicUrl
}

export async function deleteImage(url: string) {
  if (!url) return
  
  const supabase = createClient()
  
  // Ekstrak path dari URL publik Supabase
  // Format biasanya: .../storage/v1/object/public/bucket-name/folder/filename.ext
  try {
    const pathParts = url.split(`${BUCKET_NAME}/`)
    if (pathParts.length < 2) return
    
    const filePath = pathParts[1]
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])
      
    if (error) console.error('Error deleting image from storage:', error)
  } catch (err) {
    console.error('Failed to parse URL for deletion:', err)
  }
}

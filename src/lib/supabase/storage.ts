import { createClient } from './client'

export const BUCKET_NAME = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'village-assets'

export async function uploadImage(file: File, folder: string) {
  const supabase = createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return publicUrl
}

export async function deleteImage(url: string) {
  if (!url) return
  const supabase = createClient()
  try {
    const pathParts = url.split(`${BUCKET_NAME}/`)
    if (pathParts.length < 2) return
    const filePath = pathParts[1]
    await supabase.storage.from(BUCKET_NAME).remove([filePath])
  } catch (err) {
    console.error('Failed to delete image:', err)
  }
}

/**
 * Deletes the old image from storage if the URL has changed.
 */
export async function handleImageUpdate(oldUrl: string | null | undefined, newUrl: string | null | undefined) {
  if (oldUrl && oldUrl !== newUrl) {
    await deleteImage(oldUrl);
  }
}

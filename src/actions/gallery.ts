'use server'

import { createClient } from '@/lib/supabase/server'

export interface GalleryImage {
  url: string
  title: string
  source: 'post' | 'branding'
  date: string
  link?: string
}

export async function getGalleryImages(page: number = 1, limit: number = 9): Promise<GalleryImage[]> {
  const supabase = await createClient()
  
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Fetch posts with images
  const { data: posts, error } = await supabase
    .from('posts')
    .select('title, slug, image_url, created_at')
    .not('image_url', 'is', null)
    .not('image_url', 'eq', '')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching gallery images:', error)
    return []
  }

  const images: GalleryImage[] = posts.map(post => ({
    url: post.image_url!,
    title: post.title,
    source: 'post',
    date: post.created_at,
    link: `/posts/${post.slug}`
  }))

  // Add branding images only on the first page if they exist and are not empty
  if (page === 1) {
    const { data: info } = await supabase
      .from('village_info')
      .select('logo_url, header_banner_url')
      .single()

    if (info) {
      if (info.header_banner_url && info.header_banner_url.trim() !== '') {
        images.unshift({
          url: info.header_banner_url,
          title: 'Banner Utama Desa',
          source: 'branding',
          date: new Date().toISOString()
        })
      }
      if (info.logo_url && info.logo_url.trim() !== '') {
        images.unshift({
          url: info.logo_url,
          title: 'Logo Resmi Desa',
          source: 'branding',
          date: new Date().toISOString()
        })
      }
    }
  }

  return images
}

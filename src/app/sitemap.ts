import { MetadataRoute } from 'next'
import { getPosts } from '@/actions/posts'
import { Post } from '@/types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://profil-desa.id'
  
  const posts = await getPosts('published') as Post[]
  const postEntries = posts.map((post: Post) => ({
    url: `${appUrl}/posts/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${appUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${appUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${appUrl}/statistik`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${appUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${appUrl}/transparansi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...postEntries,
  ]
}

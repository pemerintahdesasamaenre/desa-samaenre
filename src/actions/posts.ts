'use server'

import { createClient } from '../lib/supabase/server'
import { postSchema, type PostInput } from '../lib/validations'
import { revalidatePost } from '@/lib/utils/revalidate'
import { handleImageUpdate, deleteImage } from '../lib/supabase/storage'
import { protectedAction } from '@/lib/utils/action-handler'

export async function createPost(data: PostInput) {
  return protectedAction(async (user) => {
    const validated = postSchema.safeParse(data)
    if (!validated.success) return { error: validated.error.flatten().fieldErrors }

    const postData = {
      ...validated.data,
      author_id: user.id,
      category_id: validated.data.category_id || null,
      event_date: validated.data.event_date || null
    }

    const supabase = await createClient()
    const { error } = await supabase.from('posts').insert(postData)
    if (error) return { error: error.message }

    revalidatePost()
    return { success: true }
  })
}

export async function updatePost(id: string, data: PostInput) {
  return protectedAction(async () => {
    const validated = postSchema.safeParse(data)
    if (!validated.success) return { error: validated.error.flatten().fieldErrors }

    const supabase = await createClient()
    
    // Cleanup old image
    const { data: current } = await supabase.from('posts').select('image_url').eq('id', id).single()
    await handleImageUpdate(current?.image_url, validated.data.image_url)

    const postData = {
      ...validated.data,
      category_id: validated.data.category_id || null,
      event_date: validated.data.event_date || null
    }

    const { error } = await supabase.from('posts').update(postData).eq('id', id)
    if (error) return { error: error.message }

    revalidatePost()
    return { success: true }
  })
}

export async function deletePost(id: string) {
  return protectedAction(async () => {
    const supabase = await createClient()
    
    // Cleanup image from storage
    const { data: post } = await supabase.from('posts').select('image_url').eq('id', id).single()
    if (post?.image_url) await deleteImage(post.image_url)

    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePost()
    return { success: true }
  })
}

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*').eq('type', 'post')
  if (error) return []
  return data
}

export async function getPosts(status?: 'draft' | 'published') {
  const supabase = await createClient()
  let query = supabase.from('posts').select('*, categories(name)')
  if (status) query = query.eq('status', status)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return []
  return (data || []).map((post) => ({
    ...post,
    categories: Array.isArray(post.categories) ? post.categories[0] : post.categories
  }))
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('posts').select('*, categories(name)').eq('slug', slug).single()
  if (error || !data) return null
  return {
    ...data,
    categories: Array.isArray(data.categories) ? data.categories[0] : data.categories
  }
}

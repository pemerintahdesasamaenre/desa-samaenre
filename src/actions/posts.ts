'use server'

import { createClient } from '../lib/supabase/server'
import { postSchema, type PostInput } from '../lib/validations'
import { revalidatePath } from 'next/cache'

export async function createPost(data: PostInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const validated = postSchema.safeParse(data)
  if (!validated.success) return { error: validated.error.flatten().fieldErrors }

  const { error } = await supabase.from('posts').insert({
    ...validated.data,
    author_id: user.id
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/posts')
  revalidatePath('/')
  return { success: true }
}

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('type', 'post')
  
  if (error) return []
  return data
}

export async function getPosts(status?: 'draft' | 'published') {
  const supabase = await createClient()
  let query = supabase.from('posts').select('*, categories(name)')
  
  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) return []
  return data
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*, categories(name)')
    .eq('slug', slug)
    .single()
  
  if (error) return null
  return data
}

export async function deletePost(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('posts').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/posts')
  return { success: true }
}

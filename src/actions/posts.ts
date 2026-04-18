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

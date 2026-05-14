'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateCategory } from '@/lib/utils/revalidate'
import { protectedAction } from '@/lib/utils/action-handler'
import { categorySchema, type CategoryInput } from '@/lib/validations'

export async function createCategory(data: CategoryInput) {
  return protectedAction(async () => {
    const validated = categorySchema.safeParse(data)
    if (!validated.success) return { error: validated.error.flatten().fieldErrors }

    const supabase = await createClient()
    const { error } = await supabase.from('categories').insert(validated.data)
    if (error) return { error: error.message }

    revalidateCategory()
    return { success: true }
  })
}

export async function updateCategory(id: string, data: CategoryInput) {
  return protectedAction(async () => {
    const validated = categorySchema.safeParse(data)
    if (!validated.success) return { error: validated.error.flatten().fieldErrors }

    const supabase = await createClient()
    const { error } = await supabase.from('categories').update(validated.data).eq('id', id)
    if (error) return { error: error.message }

    revalidateCategory()
    return { success: true }
  })
}

export async function deleteCategory(id: string) {
  return protectedAction(async () => {
    const supabase = await createClient()

    // Check if category is in use by posts
    const { count, error: countError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id)

    if (countError) return { error: countError.message }
    if (count && count > 0) {
      return { error: 'Kategori tidak dapat dihapus karena masih digunakan oleh beberapa postingan.' }
    }

    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidateCategory()
    return { success: true }
  })
}

export async function getCategoryById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single()
  if (error) return null
  return data
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  type: z.enum(['post', 'demographic', 'finance', 'gallery']),
  description: z.string().optional(),
})

export type CategoryInput = z.infer<typeof categorySchema>

export async function createCategory(data: CategoryInput) {
  const supabase = await createClient()
  
  const validated = categorySchema.safeParse(data)
  if (!validated.success) return { error: validated.error.flatten().fieldErrors }

  const { error } = await supabase.from('categories').insert(validated.data)
  if (error) return { error: error.message }

  revalidatePath('/admin/categories')
  return { success: true }
}

export async function updateCategory(id: string, data: CategoryInput) {
  const supabase = await createClient()
  
  const validated = categorySchema.safeParse(data)
  if (!validated.success) return { error: validated.error.flatten().fieldErrors }

  const { error } = await supabase.from('categories').update(validated.data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/categories')
  return { success: true }
}

export async function getCategoryById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single()
  if (error) return null
  return data
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createStaffMember(data: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('staff_members')
    .insert(data)

  if (error) return { error: error.message }

  revalidatePath('/admin/content')
  return { success: true }
}

export async function updateStaffMember(id: string, data: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('staff_members')
    .update(data)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/content')
  return { success: true }
}

export async function deleteStaffMember(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('staff_members')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/content')
  return { success: true }
}

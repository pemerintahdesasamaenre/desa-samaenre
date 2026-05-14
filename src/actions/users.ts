'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Create a new user directly in Auth and Profile
 */
export async function createUser(data: any) {
  const supabase = createAdminClient()
  const { email, password, full_name, role, nip, position, phone, address, avatar_url } = data

  const { data: user, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role, nip, position, phone, address, avatar_url }
  })

  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { data: user }
}

/**
 * Delete a user from Auth (cascades to Profile)
 */
export async function deleteUser(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.auth.admin.deleteUser(id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { success: true }
}

/**
 * Update any profile data
 */
export async function updateProfile(id: string, data: any) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  revalidatePath('/admin/settings')
  return { success: true }
}

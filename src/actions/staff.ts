'use server'

import { createClient } from '@/lib/supabase/server'
import { staffMemberSchema, type StaffMemberInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function upsertStaffMember(data: StaffMemberInput, id?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const validated = staffMemberSchema.safeParse(data)
  if (!validated.success) return { error: validated.error.flatten().fieldErrors }

  const payload = id ? { id, ...validated.data } : validated.data

  const { error } = await supabase.from('staff_members').upsert(payload)

  if (error) return { error: error.message }

  revalidatePath('/admin/staff')
  revalidatePath('/tentang')
  return { success: true }
}

export async function getStaffMembers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('staff_members')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching staff members:', error)
    return []
  }

  return data
}

export async function deleteStaffMember(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('staff_members')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/staff')
  revalidatePath('/tentang')
  return { success: true }
}

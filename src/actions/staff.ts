'use server'

import { createClient } from '@/lib/supabase/server'
import { staffMemberSchema, type StaffMemberInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { deleteImage } from '../lib/supabase/storage'

export async function upsertStaffMember(data: StaffMemberInput, id?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const validated = staffMemberSchema.safeParse(data)
  if (!validated.success) return { error: validated.error.flatten().fieldErrors }

  // 1. If updating (ID exists), check for old photo to delete
  if (id) {
    const { data: currentStaff } = await supabase.from('staff_members').select('photo_url').eq('id', id).single()
    if (currentStaff?.photo_url && currentStaff.photo_url !== validated.data.photo_url) {
      await deleteImage(currentStaff.photo_url)
    }
  }

  const payload = id ? { id, ...validated.data } : validated.data
  const { error } = await supabase.from('staff_members').upsert(payload)

  if (error) return { error: error.message }

  revalidatePath('/admin/staff')
  revalidatePath('/tentang')
  return { success: true }
}

export async function getStaffMembers(orgType?: 'pemdes' | 'bpd') {
  const supabase = await createClient()
  let query = supabase
    .from('staff_members')
    .select('*')
    .order('order_index', { ascending: true })

  if (orgType) {
    query = query.eq('org_type', orgType)
  }

  const { data, error } = await query

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

  // 1. Delete photo from storage first
  const { data: staff } = await supabase.from('staff_members').select('photo_url').eq('id', id).single()
  if (staff?.photo_url) {
    await deleteImage(staff.photo_url)
  }

  // 2. Delete from DB
  const { error } = await supabase
    .from('staff_members')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/staff')
  revalidatePath('/tentang')
  return { success: true }
}

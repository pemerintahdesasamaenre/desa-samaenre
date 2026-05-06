'use server'

import { createClient } from '@/lib/supabase/server'
import { staffMemberSchema, type StaffMemberInput } from '@/lib/validations'
import { revalidateStaff } from '@/lib/utils/revalidate'
import { getAuthUser } from '@/lib/utils/auth'
import { deleteImage } from '../lib/supabase/storage'

export async function upsertStaffMember(data: StaffMemberInput, id?: string) {
  const user = await getAuthUser()
  if (!user) return { error: 'Unauthorized' }

  const validated = staffMemberSchema.safeParse(data)
  if (!validated.success) return { error: validated.error.flatten().fieldErrors }

  const supabase = await createClient()
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

  revalidateStaff()
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
  const user = await getAuthUser()
  if (!user) return { error: 'Unauthorized' }

  const supabase = await createClient()
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

  revalidateStaff()
  return { success: true }
}

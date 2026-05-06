'use server'

import { createClient } from '@/lib/supabase/server'
import { staffMemberSchema, type StaffMemberInput } from '@/lib/validations'
import { revalidateStaff } from '@/lib/utils/revalidate'
import { protectedAction } from '@/lib/utils/action-handler'
import { handleImageUpdate, deleteImage } from '../lib/supabase/storage'

export async function upsertStaffMember(data: StaffMemberInput, id?: string) {
  return protectedAction(async () => {
    const validated = staffMemberSchema.safeParse(data)
    if (!validated.success) return { error: validated.error.flatten().fieldErrors }

    const supabase = await createClient()
    
    // Cleanup old photo if updating
    if (id) {
      const { data: current } = await supabase.from('staff_members').select('photo_url').eq('id', id).single()
      await handleImageUpdate(current?.photo_url, validated.data.photo_url)
    }

    const payload = id ? { id, ...validated.data } : validated.data
    const { error } = await supabase.from('staff_members').upsert(payload)

    if (error) return { error: error.message }

    revalidateStaff()
    return { success: true }
  })
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
  return protectedAction(async () => {
    const supabase = await createClient()
    
    // Cleanup photo from storage
    const { data: staff } = await supabase.from('staff_members').select('photo_url').eq('id', id).single()
    if (staff?.photo_url) await deleteImage(staff.photo_url)

    const { error } = await supabase.from('staff_members').delete().eq('id', id)

    if (error) return { error: error.message }

    revalidateStaff()
    return { success: true }
  })
}

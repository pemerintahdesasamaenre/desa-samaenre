'use server'

import { createClient } from '@/lib/supabase/server'
import { villageInfoSchema, type VillageInfoInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function updateVillageInfo(id: number, data: VillageInfoInput) {
  const supabase = await createClient()

  // Validate data
  const validated = villageInfoSchema.safeParse(data)
  if (!validated.success) {
    console.error('Validation Error Village Info:', validated.error.flatten().fieldErrors)
    return { error: validated.error.flatten().fieldErrors }
  }

  // Use upsert to handle case where ID 1 doesn't exist yet
  // We ensure all new fields like area_size and boundaries are included
  const { error } = await supabase
    .from('village_info')
    .upsert({
      id,
      name: validated.data.name,
      vision: validated.data.vision,
      mission: validated.data.mission,
      history: validated.data.history,
      logo_url: validated.data.logo_url,
      header_banner_url: validated.data.header_banner_url,
      area_size: validated.data.area_size,
      boundaries: validated.data.boundaries,
      contact_info: validated.data.contact_info,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Database Error Village Info:', error)
    return { error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/settings')
  revalidatePath('/tentang')
  revalidatePath('/')
  return { success: true }
}

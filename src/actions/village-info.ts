'use server'

import { createClient } from '@/lib/supabase/server'
import { villageInfoSchema, type VillageInfoInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function updateVillageInfo(id: number, data: VillageInfoInput) {
  const supabase = await createClient()

  // Validate data
  const validated = villageInfoSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  // Use upsert to handle case where ID 1 doesn't exist yet
  const { error } = await supabase
    .from('village_info')
    .upsert({
      id,
      ...validated.data,
      updated_at: new Date().toISOString()
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true }
}

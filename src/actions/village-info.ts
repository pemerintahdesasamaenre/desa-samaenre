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

  const { error } = await supabase
    .from('village_info')
    .update(validated.data)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true }
}

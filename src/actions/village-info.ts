'use server'

import { createClient } from '@/lib/supabase/server'
import { villageInfoSchema, type VillageInfoInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { handleImageUpdate } from '../lib/supabase/storage'
import { protectedAction } from '@/lib/utils/action-handler'

export async function updateVillageInfo(id: number, data: VillageInfoInput) {
  return protectedAction(async () => {
    const supabase = await createClient()

    // 1. Get current info to check for old assets
    const { data: currentInfo } = await supabase.from('village_info').select('*').eq('id', id).single()

    const validated = villageInfoSchema.safeParse(data)
    if (!validated.success) {
      return { error: validated.error.flatten().fieldErrors }
    }

    // 2. Cleanup old images
    await Promise.all([
      handleImageUpdate(currentInfo?.logo_url, validated.data.logo_url),
      handleImageUpdate(currentInfo?.header_banner_url, validated.data.header_banner_url)
    ]);

    const { error } = await supabase
      .from('village_info')
      .upsert({
        id,
        ...validated.data,
        updated_at: new Date().toISOString()
      })

    if (error) return { error: error.message }

    revalidatePath('/admin')
    revalidatePath('/admin/settings')
    revalidatePath('/tentang')
    revalidatePath('/')
    return { success: true }
  })
}

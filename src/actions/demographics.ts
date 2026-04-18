'use server'

import { createClient } from '@/lib/supabase/server'
import { demographicSchema, type DemographicInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function createDemographic(data: DemographicInput) {
  const supabase = await createClient()

  // Validate data
  const validated = demographicSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from('demographics')
    .insert(validated.data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/statistics')
  revalidatePath('/')
  return { success: true }
}

export async function updateDemographic(id: string, data: DemographicInput) {
  const supabase = await createClient()

  // Validate data
  const validated = demographicSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from('demographics')
    .update(validated.data)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/statistics')
  revalidatePath('/')
  return { success: true }
}

export async function deleteDemographic(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('demographics')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/statistics')
  revalidatePath('/')
  return { success: true }
}

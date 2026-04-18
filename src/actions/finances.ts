'use server'

import { createClient } from '@/lib/supabase/server'
import { financeSchema, type FinanceInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function addFinanceEntry(data: FinanceInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const validated = financeSchema.safeParse(data)
  if (!validated.success) return { error: validated.error.flatten().fieldErrors }

  const { error } = await supabase.from('finances').insert(validated.data)

  if (error) return { error: error.message }

  revalidatePath('/admin/finances')
  revalidatePath('/transparansi')
  return { success: true }
}

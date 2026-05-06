'use server'

import { createClient } from '@/lib/supabase/server'
import { financeSchema, type FinanceInput } from '@/lib/validations'
import { revalidateFinance } from '@/lib/utils/revalidate'
import { getAuthUser } from '@/lib/utils/auth'
import type { Finance } from '@/types'

export async function addFinanceEntry(data: FinanceInput) {
  const user = await getAuthUser()
  if (!user) return { error: 'Unauthorized' }

  const validated = financeSchema.safeParse(data)
  if (!validated.success) return { error: validated.error.flatten().fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase.from('finances').insert(validated.data)

  if (error) return { error: error.message }

  revalidateFinance()
  return { success: true }
}

export async function getFinances(year?: number) {
  const supabase = await createClient()
  let query = supabase.from('finances').select('*').order('type', { ascending: true })

  if (year) {
    query = query.eq('year', year)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching finances:', error)
    return []
  }

  return data as Finance[]
}

export async function deleteFinanceEntry(id: string) {
  const user = await getAuthUser()
  if (!user) return { error: 'Unauthorized' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('finances')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidateFinance()
  return { success: true }
}

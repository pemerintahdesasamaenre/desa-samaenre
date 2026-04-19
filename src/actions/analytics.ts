'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Increments the view counter for a specific post (news/agenda)
 * @param postId UUID of the post
 */
export async function incrementPostView(postId: string) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('increment_post_views', { post_id: postId })
  if (error) {
    console.error('Error incrementing post views:', error)
  }
}

/**
 * Increments the view counter for a specific page path
 * @param path URL path of the page
 */
export async function incrementPageView(path: string) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('increment_page_views', { path })
  if (error) {
    console.error('Error incrementing page views:', error)
  }
}

/**
 * Fetches analytics data for the admin dashboard
 */
export async function getPageAnalytics() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('page_analytics')
    .select('*')
    .order('views_count', { ascending: false })
  
  if (error) {
    console.error('Error fetching analytics:', error)
    return []
  }
  
  return data
}

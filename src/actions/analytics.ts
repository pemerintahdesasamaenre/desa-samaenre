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

/**
 * Universal activity logging function
 */
export async function logActivity(params: {
  action: string;
  entity_type: string;
  method?: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'AUTH';
  details?: Record<string, any>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.warn('logActivity: No user session found. Action not logged:', params.action);
    return;
  }

  const { error } = await supabase.from('activity_logs').insert({
    user_id: user.id,
    user_email: user.email,
    action: params.action,
    entity_type: params.entity_type,
    method: params.method,
    details: params.details || {}
  });

  if (error) {
    console.error('logActivity: Failed to insert log:', error.message);
  }
}

/**
 * Get audit logs with 2-month filter and infinite scroll
 */
export async function getAuditLogs(page: number = 1, limit: number = 20) {
  const supabase = await createClient();
  
  // Clean up old logs (side-effect during fetch for simplicity in this project)
  // We don't await this to keep the response fast
  supabase.rpc('cleanup_old_logs').then(({ error }) => {
    if (error) console.error('Cleanup logs error:', error);
  });

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  const { data, error, count } = await supabase
    .from('activity_logs')
    .select('*', { count: 'exact' })
    .gte('created_at', twoMonthsAgo.toISOString())
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    console.error('Error fetching audit logs:', error);
    return { data: [], total: 0 };
  }

  return { data, total: count || 0 };
}

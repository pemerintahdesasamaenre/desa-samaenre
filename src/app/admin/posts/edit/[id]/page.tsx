import { getCategories } from '@/actions/posts'
import { createClient } from '@/lib/supabase/server'
import PostForm from '@/components/modules/posts/PostForm'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  // Ambil data post berdasarkan ID (UUID)
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) {
    notFound()
  }

  const categories = await getCategories()

  return <PostForm initialData={post} categories={categories} isEditing />
}

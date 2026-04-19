import { getCategoryById } from '@/actions/categories'
import CategoryForm from '@/components/modules/categories/CategoryForm'
import { notFound } from 'next/navigation'

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const category = await getCategoryById(id)
  
  if (!category) {
    notFound()
  }

  return <CategoryForm initialData={category} isEditing />
}

import { getCategories, getRawDemographics } from '@/services/data-service';
import DemographicForm from '@/components/modules/statistics/DemographicForm';
import { notFound } from 'next/navigation';

export default async function EditDemographicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categories = await getCategories('demographic');
  const demographics = await getRawDemographics();
  
  const initialData = demographics.find((d) => d.id === id);

  if (!initialData) {
    notFound();
  }

  return (
    <DemographicForm 
      categories={categories} 
      initialData={initialData} 
      isEditing 
    />
  );
}

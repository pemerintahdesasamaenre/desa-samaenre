import { getCategories, getRawDemographics } from '@/services/data-service';
import DemographicForm from '@/components/modules/statistics/DemographicForm';
import { notFound } from 'next/navigation';

export default async function EditDemographicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categories = await getCategories('demographic');
  const demographics = await getRawDemographics();
  
  const rawData = demographics.find((d) => d.id === id);

  if (!rawData) {
    notFound();
  }

  // Cari category id berdasarkan slug yang digenerate di getRawDemographics
  const categorySlug = rawData.category.name.toLowerCase().replace(' ', '_');
  const matchedCategory = categories.find((c) => c.slug === categorySlug);

  const initialData = {
    id: rawData.id,
    category_id: matchedCategory?.id || categories[0]?.id || '',
    label: rawData.label,
    value: rawData.value,
  };

  return (
    <DemographicForm 
      categories={categories} 
      initialData={initialData} 
      isEditing 
    />
  );
}

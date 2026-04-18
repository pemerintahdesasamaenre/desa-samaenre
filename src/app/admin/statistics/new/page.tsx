import { getCategories } from '@/services/data-service';
import DemographicForm from '@/components/modules/statistics/DemographicForm';

export default async function NewDemographicPage() {
  const categories = await getCategories('demographic');

  return <DemographicForm categories={categories} />;
}

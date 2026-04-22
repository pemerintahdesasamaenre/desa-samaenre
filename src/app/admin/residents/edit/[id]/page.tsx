import { getResidentById } from '@/actions/residents';
import ResidentForm from '@/components/modules/residents/ResidentForm';
import { notFound } from 'next/navigation';

export default async function EditResidentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resident = await getResidentById(id);

  if (!resident) {
    notFound();
  }

  return (
    <ResidentForm 
      initialData={resident} 
      isEditing 
    />
  );
}

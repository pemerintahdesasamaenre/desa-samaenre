import { getResidentById } from '@/actions/residents';
import ResidentForm from '@/components/modules/residents/ResidentForm';
import { notFound } from 'next/navigation';

export default async function EditResidentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (!id) return notFound();

  const resident = await getResidentById(id);

  if (!resident) {
    console.error('Resident not found for ID:', id);
    return notFound();
  }

  return (
    <ResidentForm 
      initialData={resident} 
      isEditing 
    />
  );
}

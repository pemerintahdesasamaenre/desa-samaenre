import { getProfiles } from '@/services/data-service';
import { Profile } from '@/types';
import { UserManagement } from '@/components/modules/users/UserManagement';

export default async function AdminUsersPage() {
  const profiles = await getProfiles() as Profile[];

  return <UserManagement initialProfiles={profiles} />;
}

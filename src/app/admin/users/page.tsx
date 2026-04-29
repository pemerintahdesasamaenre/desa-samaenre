import { getProfiles } from '@/services/data-service';
import { Profile } from '@/types';
import { InviteForm } from '@/components/modules/users/InviteForm';
import { UserTable } from '@/components/modules/users/UserTable';

export default async function AdminUsersPage() {
  const profiles = await getProfiles() as Profile[];

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <div className="bg-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm">
        <h1 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tighter uppercase">Manajemen User</h1>
        <p className="text-xs sm:text-base text-muted-foreground mt-1 font-medium">Kelola administrator desa dan undang tim pengelola baru.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-1">
           <InviteForm />
        </div>

        <div className="lg:col-span-2">
           <UserTable profiles={profiles} />
        </div>
      </div>
    </div>
  );
}

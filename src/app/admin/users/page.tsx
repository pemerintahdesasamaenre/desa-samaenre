import { getProfiles } from '@/services/data-service';
import { Profile } from '@/types';
import { InviteForm } from '@/components/modules/users/InviteForm';
import { UserTable } from '@/components/modules/users/UserTable';
import { UserCog } from 'lucide-react';

export default async function AdminUsersPage() {
  const profiles = await getProfiles() as Profile[];

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <div className="bg-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 sm:p-2.5 bg-muted rounded-xl border border-border flex items-center justify-center text-primary shrink-0">
             <UserCog size={20} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Manajemen User</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">Kelola administrator desa dan undang tim pengelola baru.</p>
          </div>
        </div>
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

'use client';

import { useState } from 'react';
import { UserCog, Plus, X } from 'lucide-react';
import { Profile } from '@/types';
import { UserTable } from '@/components/modules/users/UserTable';
import { UserForm } from '@/components/modules/users/UserForm';

interface UserManagementProps {
  initialProfiles: Profile[];
}

export const UserManagement = ({ initialProfiles }: UserManagementProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | undefined>(undefined);

  const handleEdit = (user: Profile) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(undefined);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingUser(undefined);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <div className="bg-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 sm:p-2.5 bg-muted rounded-xl border border-border flex items-center justify-center text-primary shrink-0">
             <UserCog size={20} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Manajemen User</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">Kelola administrator desa dan undang tim pengelola baru.</p>
          </div>
        </div>
        
        <button 
          onClick={handleAdd}
          className="bg-primary text-primary-foreground px-6 h-12 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/30 uppercase text-[10px] tracking-widest active:scale-95"
        >
          <Plus size={18} /> Tambah User
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        <UserTable profiles={initialProfiles} onEdit={handleEdit} />
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <UserCog size={24} />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">
                  {editingUser ? 'Edit Administrator' : 'Tambah Administrator'}
                </h3>
              </div>
              <button onClick={handleClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <UserForm 
                user={editingUser} 
                onSuccess={handleClose} 
                onCancel={handleClose} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

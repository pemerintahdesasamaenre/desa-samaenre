// src/components/modules/home/VillageApparatus.tsx
import Link from 'next/link';
import Image from 'next/image';

interface Staff {
  name: string;
  position: string;
  photo_url: string | null;
}

interface VillageApparatusProps {
  staff: Staff[];
}

export default function VillageApparatus({ staff }: VillageApparatusProps) {
  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">Kenali Perangkat Desa Anda</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {staff.map((member) => (
            <div key={member.name} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                {member.photo_url ? (
                  <Image src={member.photo_url} alt={member.name} layout="fill" objectFit="cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-xl font-bold">{member.name}</h3>
              <p className="mt-1 text-blue-600 font-semibold">{member.position}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link href="/tentang" className="px-8 py-3 border border-slate-300 dark:border-slate-600 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Lihat Struktur Lengkap
          </Link>
        </div>
      </div>
    </div>
  );
}

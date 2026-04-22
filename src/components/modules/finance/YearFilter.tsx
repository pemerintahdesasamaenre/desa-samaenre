'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import CustomSelect from '@/components/ui/CustomSelect';
import { Calendar } from 'lucide-react';

interface YearFilterProps {
  currentYear: number;
}

export default function YearFilter({ currentYear }: YearFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedYear = searchParams.get('year') || currentYear.toString();

  const years = Array.from({ length: 5 }, (_, i) => ({
    id: (currentYear - i).toString(),
    name: (currentYear - i).toString()
  }));

  function handleYearChange(year: string) {
    router.push(`/transparansi?year=${year}`);
  }

  return (
    <div className="w-full sm:w-48 relative z-[50]">
      <CustomSelect
        options={years}
        value={selectedYear}
        onChange={handleYearChange}
        icon={Calendar}
        placeholder="Pilih Tahun"
      />
    </div>
  );
}

'use client'

import { useRouter, useSearchParams } from 'next/navigation';

interface YearFilterProps {
  currentYear: number;
}

export default function YearFilter({ currentYear }: YearFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedYear = searchParams.get('year') || currentYear;

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const year = e.target.value;
    router.push(`/transparansi?year=${year}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="year-select" className="text-sm font-medium text-slate-700">
        Tahun:
      </label>
      <select
        id="year-select"
        name="year"
        value={selectedYear}
        onChange={handleYearChange}
        className="rounded-lg border-slate-200 text-sm focus:ring-blue-500 focus:border-blue-500"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}

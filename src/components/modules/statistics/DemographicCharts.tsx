'use client';


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface ChartProps {
  data: any;
}


export const DemographicCharts = ({ data }: ChartProps) => {
  const genderData = [
    { name: 'Laki-laki', value: data.population.male },
    { name: 'Perempuan', value: data.population.female }
  ];

  const PREMIUM_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  return (
    <div className="space-y-12 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Gender Pie Chart */}
        <div className="glass-premium p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -z-10"></div>
          <h3 className="text-xl font-black mb-10 tracking-tight text-foreground">Proporsi Jenis Kelamin</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={10}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {genderData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#ec4899'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '1.5rem',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    backdropFilter: 'blur(20px)',
                    padding: '1.25rem',
                    fontSize: '14px',
                    fontWeight: 800
                  }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Legend iconType="circle" verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hamlet Bar Chart */}
        <div className="glass-premium p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-[50px] -z-10"></div>
          <h3 className="text-xl font-black mb-10 tracking-tight text-foreground">Penduduk per Dusun</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hamlets} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/20" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'currentColor', fontSize: 13, fontWeight: 700 }}
                  className="text-foreground/80 dark:text-foreground/90"
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'currentColor', fontSize: 13, fontWeight: 700 }}
                  className="text-foreground/80 dark:text-foreground/90"
                />
                <Tooltip 
                   cursor={{ fill: 'currentColor', className: 'text-primary/5' }}
                   contentStyle={{ 
                     backgroundColor: 'var(--card)', 
                     border: '1px solid var(--border)',
                     borderRadius: '1.5rem',
                     padding: '1.25rem',
                     fontWeight: 800
                   }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[10, 10, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Occupation Horizontal Bar Chart */}
      <div className="glass-premium p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden md:col-span-2">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/2 rounded-full blur-[120px] -z-10"></div>
        <h3 className="text-2xl font-black mb-12 tracking-tight text-foreground">Sepuluh Pekerjaan Tertinggi</h3>
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.occupations}
              layout="vertical"
              margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-border/20" />
              <XAxis 
                type="number" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 700 }}
                className="text-foreground/60 dark:text-foreground/80"
              />
              <YAxis 
                dataKey="label" 
                type="category" 
                width={160} 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 800 }}
                className="text-foreground/80 dark:text-foreground/90"
              />
              <Tooltip 
                 cursor={{ fill: 'currentColor', className: 'text-primary/5' }}
                 contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '1.5rem',
                  padding: '1.25rem',
                  fontWeight: 800
                }}
              />
              <Bar dataKey="value" fill="#6366F1" radius={[0, 10, 10, 0]} barSize={35}>
                {data.occupations.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={PREMIUM_COLORS[index % PREMIUM_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

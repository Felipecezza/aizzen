
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { colors } from "@/styles/colors";

interface TrafficMetricsProps {
  platform: string;
}

export const TrafficMetrics = ({ platform }: TrafficMetricsProps) => {
  // Dados mockados para exemplo
  const data = [
    { name: 'Seg', clicks: 400, impressions: 2400 },
    { name: 'Ter', clicks: 300, impressions: 1398 },
    { name: 'Qua', clicks: 200, impressions: 9800 },
    { name: 'Qui', clicks: 278, impressions: 3908 },
    { name: 'Sex', clicks: 189, impressions: 4800 },
    { name: 'Sab', clicks: 239, impressions: 3800 },
    { name: 'Dom', clicks: 349, impressions: 4300 },
  ];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="clicks" fill="hsl(var(--primary))" />
          <Bar dataKey="impressions" fill="hsl(var(--muted))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

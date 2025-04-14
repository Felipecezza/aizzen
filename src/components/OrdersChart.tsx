
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLogzzOrders } from '@/hooks/useLogzzOrders';
import { DateRange } from "react-day-picker";
import { Loader2 } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, subDays, startOfDay, endOfDay, getHours, setHours, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { colors } from "@/styles/colors";

interface OrdersChartProps {
  filter: string;
  dateRange?: DateRange;
}

const OrdersChart = ({ filter, dateRange }: OrdersChartProps) => {
  const { data: orders, isLoading } = useLogzzOrders({ 
    filter, 
    dateRange 
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getChartData = () => {
    // Filtrar apenas pedidos completos
    const completedOrders = orders?.filter(order => 
      order.status?.toLowerCase() === 'completo'
    ) || [];

    const today = new Date();
    let timeSlots = [];

    if (filter === 'Hoje' || filter === 'Ontem') {
      const baseDate = filter === 'Hoje' ? today : subDays(today, 1);
      timeSlots = Array.from({ length: 24 }, (_, i) => ({
        date: setHours(startOfDay(baseDate), i),
        key: `${String(i).padStart(2, '0')}:00`,
        value: 0,
        sales: 0,
        commission: 0
      }));
    } else if (filter === '7 Dias') {
      timeSlots = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(today, i);
        return {
          date,
          key: format(date, 'dd/MM'),
          value: 0,
          sales: 0,
          commission: 0
        };
      }).reverse();
    } else {
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      timeSlots = daysInMonth.map(date => ({
        date,
        key: format(date, 'dd/MM'),
        value: 0,
        sales: 0,
        commission: 0
      }));
    }

    // Preencher os slots com os dados dos pedidos completos
    completedOrders.forEach(order => {
      if (!order.created_at) return;
      
      const orderDate = parseISO(order.created_at);
      let slot;

      if (filter === 'Hoje' || filter === 'Ontem') {
        const hour = getHours(orderDate);
        slot = timeSlots.find(s => getHours(s.date) === hour);
      } else {
        slot = timeSlots.find(s => 
          format(s.date, 'dd/MM') === format(orderDate, 'dd/MM')
        );
      }

      if (slot) {
        slot.value += order.order_final_price || 0;
        slot.commission += order.commission || 0;
        slot.sales += 1;
      }
    });

    // Formatar dados para o gráfico
    return timeSlots.map(slot => ({
      date: slot.key,
      value: Number(slot.value.toFixed(2)),
      commission: Number(slot.commission.toFixed(2)),
      sales: slot.sales
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm">
          <p className="text-zinc-400 mb-1">Data: {label}</p>
          <div className="space-y-1">
            <p className="text-zinc-400">
              Vendas: <span className="text-white">{payload[0].payload.sales}</span>
            </p>
            <p className="text-zinc-400">
              Valor Total:{' '}
              <span className="text-white">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(payload[0].payload.value)}
              </span>
            </p>
            <p className="text-zinc-400">
              Comissão:{' '}
              <span className="text-white">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(payload[0].payload.commission)}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const chartData = getChartData();

  return (
    <div className="h-full w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          barSize={40}
        >
          <XAxis 
            dataKey="date" 
            stroke="#666"
            tick={{ fill: '#666', fontSize: 12 }}
            axisLine={{ stroke: '#333' }}
          />
          <YAxis 
            stroke="#666"
            tick={{ fill: '#666', fontSize: 12 }}
            axisLine={{ stroke: '#333' }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          />
          <Bar 
            dataKey="value" 
            name="Valor Total"
            fill={colors.primary.DEFAULT}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersChart;


import { Card } from "@/components/ui/card";
import { useLogzzOrders, useOrderMetrics } from "@/hooks/useLogzzOrders";
import { DateRange } from "react-day-picker";
import { Loader2, DollarSign, Percent } from "lucide-react";
import { colors } from "@/styles/colors";

interface OrdersMetricsProps {
  filter: string;
  dateRange?: DateRange;
}

export const OrdersMetrics = ({ filter, dateRange }: OrdersMetricsProps) => {
  const { data: orders, isLoading } = useLogzzOrders({ 
    filter, 
    dateRange 
  });
  const metrics = useOrderMetrics(orders || []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate ROI
  const marketingCost = 219.84; // Fixed marketing cost
  const roi = metrics.totalCommission > 0 
    ? ((metrics.totalCommission - marketingCost) / marketingCost) * 100 
    : 0;

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-dark-600 rounded-lg">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Receita Líquida</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-semibold text-white">
              R$ {metrics.totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-primary text-xs">+ 0.00% a mais</span>
        </div>
      </Card>

      <Card className="p-4 bg-dark-600 rounded-lg">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Marketing</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-semibold text-white">
              R$ {marketingCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-primary text-xs">+ 0.00% a mais</span>
        </div>
      </Card>

      <Card className="p-4 bg-dark-600 rounded-lg">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">ROI</span>
            <Percent className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-semibold text-white">
              {roi.toLocaleString('pt-BR', { maximumFractionDigits: 3 })}%
            </span>
          </div>
          <span className="text-primary text-xs">+ 0.00% a mais</span>
        </div>
      </Card>
    </div>
  );
};

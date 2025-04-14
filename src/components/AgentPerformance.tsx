
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { MessageCircle, ShoppingCart, Percent } from "lucide-react";

interface AgentPerformanceProps {
  period: string;
  dateRange?: DateRange;
}

export const AgentPerformance = ({ period, dateRange }: AgentPerformanceProps) => {
  // Dummy data for agent performance
  const performance = {
    messages: 120,
    sales: 35,
    conversionRate: 29.17
  };

  return (
    <div className="mt-6 rounded-lg bg-dark-700 border border-zinc-800">
      <div className="p-4">
        <h2 className="text-subtitle">Desempenho do Agente</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="flex items-center space-x-4 rounded-lg border border-zinc-800 p-4 bg-dark-700">
          <div className="rounded-full bg-primary/20 p-3">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-caption">Mensagens</p>
            <p className="text-xl font-semibold text-white">
              {performance.messages}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-lg border border-zinc-800 p-4 bg-dark-700">
          <div className="rounded-full bg-primary/20 p-3">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-caption">Vendas</p>
            <p className="text-xl font-semibold text-white">
              {performance.sales}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-lg border border-zinc-800 p-4 bg-dark-700">
          <div className="rounded-full bg-primary/20 p-3">
            <Percent className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-caption">Taxa de Conversão</p>
            <p className="text-xl font-semibold text-white">{performance.conversionRate.toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

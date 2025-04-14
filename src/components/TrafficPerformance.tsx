
import { DollarSign, Percent } from "lucide-react";

interface TrafficPerformanceProps {
  data: {
    costPerConversation: number;
    costPerAcquisition: number;
    roi: number;
  };
}

export const TrafficPerformance = ({
  data
}: TrafficPerformanceProps) => (
  <div className="mt-6 rounded-lg bg-dark-700 border border-zinc-800">
    <div className="p-4">
      <h2 className="text-subtitle">Desempenho do Tráfego</h2>
    </div>
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="flex items-center space-x-4 rounded-lg border border-zinc-800 p-4 bg-dark-700">
        <div className="rounded-full bg-primary/20 p-3">
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-caption">Custo por Conversa</p>
          <p className="text-xl font-semibold text-white">
            R$ {data.costPerConversation.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4 rounded-lg border border-zinc-800 p-4 bg-dark-700">
        <div className="rounded-full bg-primary/20 p-3">
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-caption">Custo por Aquisição</p>
          <p className="text-xl font-semibold text-white">
            R$ {data.costPerAcquisition.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4 rounded-lg border border-zinc-800 p-4 bg-dark-700">
        <div className="rounded-full bg-primary/20 p-3">
          <Percent className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-caption">ROI da Campanha</p>
          <p className="text-xl font-semibold text-white">{data.roi.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  </div>
);

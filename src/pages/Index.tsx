import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateFilter } from "@/components/DateFilter";
import { OrdersMetrics } from "@/components/OrdersMetrics";
import OrdersChart from "@/components/OrdersChart";
import { useLogzzOrders } from "@/hooks/useLogzzOrders";
import { OrdersTable } from "@/components/OrdersTable";
import { AgentPerformance } from "@/components/AgentPerformance";
import { TrafficPerformance } from "@/components/TrafficPerformance";

const Index = () => {
  const [selectedFilter, setSelectedFilter] = useState("7 Dias");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleFilterChange = (filter: string, range?: DateRange) => {
    setSelectedFilter(filter);
    setDateRange(range);
  };

  const {
    data: orders
  } = useLogzzOrders({
    filter: selectedFilter,
    dateRange
  });

  const trafficData = {
    costPerConversation: 0.88,
    costPerAcquisition: 5.52,
    roi: 0.63
  };

  return (
    <div className="space-y-4">
      <DateFilter selectedFilter={selectedFilter} onFilterChange={handleFilterChange} />

      <div className="grid grid-cols-12 gap-4">
        {/* Main content - 9 columns */}
        <div className="col-span-12 lg:col-span-9">
          <div className="h-[372px] p-6 bg-dark-700 rounded-lg border border-zinc-800">
            <div className="space-y-1">
              <span className="text-sm text-gray-400">Lucro Líquido</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-primary">
                  R$ 720,80
                </span>
                <span className="text-xs text-[#4fefa2]">+ 0.00% a mais neste período</span>
              </div>
            </div>

            <div className="h-[calc(100%-40px)]">
              <OrdersChart filter={selectedFilter} dateRange={dateRange} />
            </div>
          </div>
        </div>

        {/* Sidebar - 3 columns */}
        <div className="col-span-12 lg:col-span-3">
          <OrdersMetrics filter={selectedFilter} dateRange={dateRange} />
        </div>
      </div>

      {/* Full width sections */}
      <div className="w-full">
        <div className="mt-4">
          <AgentPerformance period={selectedFilter} dateRange={dateRange} />
        </div>

        <div className="mt-4">
          <TrafficPerformance data={trafficData} />
        </div>
      </div>
    </div>
  );
};

export default Index;

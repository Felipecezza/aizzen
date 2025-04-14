import { mockOrders } from "@/data/mockOrders";
import { getDateRangeForFilter, isDateInRange, formatDateToDisplay } from "./dateHelpers";
import { DateRange } from "react-day-picker";
import { Order } from '@/data/mockOrders';

const COMMISSION_PER_SALE = 58.79;
const MARKETING_COST_PER_SALE = 13.74;

interface SaleData {
  date: string;
  value: number;
  salesCount: number;
}

export const calculateOrderMetrics = (orders: typeof mockOrders, dateRange: { startDate: Date; endDate: Date }) => {
  const filteredOrders = orders.filter(order => 
    isDateInRange(new Date(order.date), dateRange.startDate, dateRange.endDate)
  );

  const totalSales = filteredOrders.length;
  const revenue = totalSales * COMMISSION_PER_SALE;
  const marketing = totalSales * MARKETING_COST_PER_SALE;
  const profit = revenue - marketing;
  const roi = marketing > 0 ? ((profit / marketing) * 100) : 0;

  return {
    revenue,
    marketing,
    profit,
    roi,
    totalSales,
  };
};

export const generateSalesData = (filter: string, range?: DateRange): SaleData[] => {
  const dateRange = range?.from && range?.to 
    ? { startDate: range.from, endDate: range.to }
    : getDateRangeForFilter(filter);

  const data: SaleData[] = [];
  const filteredOrders = mockOrders.filter(order => 
    isDateInRange(new Date(order.date), dateRange.startDate, dateRange.endDate)
  );

  if (filter === "Hoje" || filter === "Ontem") {
    // Group by hour for single day view
    const hourlyData: Record<number, { value: number; count: number }> = {};
    
    filteredOrders.forEach(order => {
      const hour = new Date(order.date).getHours();
      if (!hourlyData[hour]) {
        hourlyData[hour] = { value: 0, count: 0 };
      }
      hourlyData[hour].value += COMMISSION_PER_SALE;
      hourlyData[hour].count += 1;
    });

    for (let hour = 0; hour < 24; hour++) {
      data.push({
        date: `${hour.toString().padStart(2, '0')}:00`,
        value: hourlyData[hour]?.value || 0,
        salesCount: hourlyData[hour]?.count || 0
      });
    }
  } else {
    // Group by date for multi-day view
    const dailyData: Record<string, { value: number; count: number }> = {};
    
    filteredOrders.forEach(order => {
      const date = formatDateToDisplay(new Date(order.date));
      if (!dailyData[date]) {
        dailyData[date] = { value: 0, count: 0 };
      }
      dailyData[date].value += COMMISSION_PER_SALE;
      dailyData[date].count += 1;
    });

    Object.entries(dailyData).forEach(([date, metrics]) => {
      data.push({
        date,
        value: metrics.value,
        salesCount: metrics.count
      });
    });
  }

  return data;
};

export interface SalesMetrics {
  totalOrders: number;
  completedOrders: number;
  completionRate: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export const calculateSalesMetrics = (orders: Order[], startDate: Date, endDate: Date): SalesMetrics => {
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= startDate && orderDate <= endDate;
  });

  const completedOrders = filteredOrders.filter(order => order.status === 'Concluído');
  const totalOrders = filteredOrders.length;
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

  return {
    totalOrders,
    completedOrders: completedOrders.length,
    completionRate: totalOrders > 0 ? (completedOrders.length / totalOrders) * 100 : 0,
    totalRevenue,
    averageOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0
  };
};
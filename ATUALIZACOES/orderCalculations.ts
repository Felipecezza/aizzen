import { Order } from "./mockOrders";

export interface SalesMetrics {
  totalOrders: number;
  completedOrders: number;
  completionRate: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export const calculateOrderMetrics = (orders: Order[], dateRange: { startDate: Date; endDate: Date }) => {
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= dateRange.startDate && orderDate <= dateRange.endDate;
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

export const generateSalesData = (filter: string, range?: any) => {
  // Implementação simplificada para exemplo
  return [
    { date: '2024-01-01', value: 100, salesCount: 5 },
    { date: '2024-01-02', value: 150, salesCount: 7 },
    { date: '2024-01-03', value: 200, salesCount: 10 }
  ];
}; 
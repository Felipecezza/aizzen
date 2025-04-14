import { DateRange } from "react-day-picker";
import { mockOrders } from "@/data/mockOrders";
import { getDateRangeForFilter } from "./dateHelpers";
import { calculateOrderMetrics, generateSalesData } from "./orderCalculations";
import { supabase } from "./supabaseClient";

export const calculatePreviousPeriod = (filter: string, range?: DateRange) => {
  // Get current period date range
  const currentRange = range?.from && range?.to 
    ? { startDate: range.from, endDate: range.to }
    : getDateRangeForFilter(filter);

  // Calculate previous period date range
  const daysDiff = Math.ceil(
    (currentRange.endDate.getTime() - currentRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const previousStart = new Date(currentRange.startDate);
  previousStart.setDate(previousStart.getDate() - (daysDiff + 1));
  const previousEnd = new Date(currentRange.startDate);
  previousEnd.setDate(previousEnd.getDate() - 1);

  const previousRange = { startDate: previousStart, endDate: previousEnd };

  // Calculate metrics for both periods
  const current = calculateOrderMetrics(mockOrders, currentRange);
  const previous = calculateOrderMetrics(mockOrders, previousRange);

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return { value: "0.00", isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(2),
      isPositive: change > 0
    };
  };

  // We removed message-related calculations here

  return {
    current: {
      ...current,
      salesData: generateSalesData(filter, range),
      costPerAcquisition: current.totalSales > 0 ? (current.marketing / current.totalSales) : 0
    },
    percentageChanges: {
      profit: calculatePercentageChange(current.profit, previous.profit),
      revenue: calculatePercentageChange(current.revenue, previous.revenue),
      marketing: calculatePercentageChange(current.marketing, previous.marketing),
      roi: calculatePercentageChange(current.roi, previous.roi)
    }
  };
};

export const calculateSalesMetrics = (orders: any[], dateRange: { startDate: Date; endDate: Date }) => {
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= dateRange.startDate && orderDate <= dateRange.endDate;
  });

  const completedOrders = filteredOrders.filter(order => order.status === 'Concluído');
  
  return {
    totalOrders: filteredOrders.length,
    completedOrders: completedOrders.length,
    completionRate: filteredOrders.length > 0 
      ? (completedOrders.length / filteredOrders.length) * 100 
      : 0,
    totalRevenue: completedOrders.reduce((sum, order) => sum + (order.total || 0), 0),
    averageOrderValue: completedOrders.length > 0
      ? completedOrders.reduce((sum, order) => sum + (order.total || 0), 0) / completedOrders.length
      : 0
  };
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      .select();

    if (error) throw error;

    // Se o status foi alterado para "Concluído", atualizar métricas
    if (newStatus === 'Concluído') {
      await updateSalesMetrics(orderId);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    return { success: false, error };
  }
};

const updateSalesMetrics = async (orderId: string) => {
  try {
    // Buscar o pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    // Atualizar métricas de vendas
    const { error: metricsError } = await supabase.rpc('update_sales_metrics', {
      p_order_id: orderId,
      p_total: order.total,
      p_user_id: order.user_id
    });

    if (metricsError) throw metricsError;

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar métricas de vendas:", error);
    return { success: false, error };
  }
};

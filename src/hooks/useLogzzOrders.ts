import { supabase } from "@/lib/supabase";
import { DateRange } from "react-day-picker";
import { getDateRangeForFilter } from "@/utils/dateHelpers";
import { LogzzOrder } from "@/utils/order-types";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export type { LogzzOrder };

export interface OrderFilters {
  dateRange?: DateRange;
  status?: string | null;
  client?: string | null;
  product?: string | null;
  orderNumber?: string | null;
  affiliate?: string | null;
  document?: string | null;
  phone?: string | null;
  filter?: string;
}

export const useLogzzOrders = (filters: OrderFilters = {}) => {
  const queryClient = useQueryClient();
  
  const dateFilter = filters.dateRange?.from && filters.dateRange?.to
    ? { startDate: filters.dateRange.from, endDate: filters.dateRange.to }
    : filters.filter ? getDateRangeForFilter(filters.filter) : null;

  useEffect(() => {
    const channel = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'logzz_orders'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orders', filters] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters, queryClient]);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      let query = supabase
        .from('logzz_orders')
        .select('*');

      // Apply date filter if provided
      if (dateFilter) {
        query = query
          .gte('created_at', dateFilter.startDate.toISOString())
          .lte('created_at', dateFilter.endDate.toISOString());
      }

      // Apply other filters if provided
      if (filters.status) {
        // Use 'as any' to bypass the strict type checking
        query = query.eq('status', filters.status as any);
      }

      if (filters.client) {
        query = query.ilike('client_name', `%${filters.client}%`);
      }

      if (filters.product) {
        // For product filtering, we need to query the JSON array
        query = query.contains('products', [{ name: filters.product }]);
      }

      if (filters.orderNumber) {
        query = query.ilike('order_number', `%${filters.orderNumber}%`);
      }

      if (filters.affiliate) {
        query = query.ilike('affiliate_name', `%${filters.affiliate}%`);
      }

      if (filters.document) {
        query = query.ilike('client_documment', `%${filters.document}%`);
      }

      if (filters.phone) {
        query = query.ilike('client_phone', `%${filters.phone}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      // Cast the data to the expected type using unknown as intermediate step
      return data as unknown as LogzzOrder[];
    },
  });

  return {
    data,
    error,
    isLoading,
    refetch,
  };
};

export const useOrderMetrics = (orders: LogzzOrder[]) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + (order.order_final_price || 0), 0);
  const totalCommission = orders.reduce((acc, order) => acc + (order.commission || 0), 0);
  const averageRevenue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalOrders,
    totalRevenue,
    totalCommission,
    averageRevenue,
  };
};

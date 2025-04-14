import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DateRange } from "react-day-picker";
import { useEffect } from "react";
import { getDateRangeForFilter } from "@/utils/dateHelpers";

export const useChatwootMetrics = (filter: string, dateRange?: DateRange) => {
  const dateFilter = dateRange?.from && dateRange?.to
    ? { startDate: dateRange.from, endDate: dateRange.to }
    : getDateRangeForFilter(filter);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['chatwoot-metrics', filter, dateFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chatwoot_metrics')
        .select('*')
        .gte('date', dateFilter.startDate.toISOString().split('T')[0])
        .lte('date', dateFilter.endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    // Subscribe to realtime changes on the chatwoot_metrics table
    const channel = supabase
      .channel('chatwoot_metrics_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'chatwoot_metrics',
          filter: `date=gte.${dateFilter.startDate.toISOString().split('T')[0]}&date=lte.${dateFilter.endDate.toISOString().split('T')[0]}`
        },
        () => {
          // Refetch data when changes occur
          refetch();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, dateFilter.startDate, dateFilter.endDate]);

  return {
    data,
    error,
    isLoading
  };
};
import { format } from "date-fns";
import { LogzzOrder } from "@/hooks/useLogzzOrders";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { getStatusTailwindClass } from "@/utils/orderHelpers";
interface OrdersTableProps {
  orders: LogzzOrder[];
}
export const OrdersTable = ({
  orders
}: OrdersTableProps) => {
  const queryClient = useQueryClient();
  const {
    toast
  } = useToast();
  useEffect(() => {
    const channel = supabase.channel('orders_changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'logzz_orders'
    }, (payload: RealtimePostgresChangesPayload<LogzzOrder>) => {
      console.log('Realtime update received:', payload);
      queryClient.invalidateQueries({
        queryKey: ['orders']
      });
      if (payload.new && 'order_number' in payload.new) {
        toast({
          title: "Atualização de Pedido",
          description: `O pedido ${payload.new.order_number} foi atualizado para ${payload.new.status || 'status desconhecido'}.`
        });
      }
    }).subscribe(status => {
      console.log('Subscription status:', status);
    });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  // Log available orders for debugging
  console.log('All orders:', orders);

  // Get all orders, sort by date (most recent first)
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
  console.log('Sorted orders:', sortedOrders);

  // Take the first 3 orders after sorting (without filtering by status)
  const recentOrders = sortedOrders.slice(0, 3);
  console.log('Recent orders selected:', recentOrders);
  if (!orders || orders.length === 0) {
    return <div className="">
        
      </div>;
  }
  if (!recentOrders || recentOrders.length === 0) {
    return <div className="rounded-lg bg-dark-700 p-8 text-center border border-zinc-800">
        <p className="text-primary">Nenhum pedido disponível</p>
      </div>;
  }
  return <div className="rounded-lg bg-dark-700 border border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 text-left text-sm text-zinc-400">
            <th className="p-3">PEDIDO</th>
            <th className="p-3">CLIENTE</th>
            <th className="p-3">PRODUTO</th>
            <th className="p-3">COMISSÃO</th>
            <th className="p-3">STATUS</th>
            <th className="p-3">DATA</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map(order => <tr key={order.order_number} className="border-b border-zinc-800 text-sm text-zinc-300 transition-colors hover:bg-zinc-800">
              <td className="p-3">{order.order_number}</td>
              <td className="p-3">{order.client_name || 'Cliente não informado'}</td>
              <td className="p-3">
                {order.products && order.products.length > 0 ? `${order.products[0].name} ${order.products.length > 1 ? `(+${order.products.length - 1})` : ''}` : 'Sem produtos'}
              </td>
              <td className="p-3">
                {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(order.commission || 0)}
              </td>
              <td className="p-3">
                <span className={`inline-flex items-center justify-center min-w-[90px] rounded-full px-3 py-1 text-xs ${getStatusTailwindClass(order.status)}`}>
                  {order.status || 'Aguardando'}
                </span>
              </td>
              <td className="p-3">
                {order.created_at ? format(new Date(order.created_at), "dd/MM/yyyy") : '-'}
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>;
};
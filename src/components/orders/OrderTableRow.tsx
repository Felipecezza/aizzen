import { format } from "date-fns";
import { LogzzOrder } from "@/hooks/useLogzzOrders";
import { OrderCheckbox } from "./OrderCheckbox";
import { getStatusTailwindClass } from "@/utils/orderHelpers";
import { ReactNode } from "react";

interface OrderTableRowProps {
  order: LogzzOrder;
  isSelected: boolean;
  onSelectOrder: (orderNumber: string, isSelected: boolean) => void;
  children?: ReactNode;
}

export const OrderTableRow = ({ order, isSelected, onSelectOrder, children }: OrderTableRowProps) => {
  return (
    <tr className="border-b border-zinc-800 text-sm text-gray-300 transition-colors hover:bg-zinc-800">
      <td className="p-3">
        <div className="flex items-center justify-center">
          <OrderCheckbox 
            checked={isSelected}
            onCheckedChange={(checked) => onSelectOrder(order.order_number, !!checked)} 
          />
        </div>
      </td>
      <td className="p-3">{order.order_number}</td>
      <td className="p-3">{order.client_name || 'Cliente não informado'}</td>
      <td className="p-3">
        {order.products && order.products.length > 0 
          ? `${order.products[0].name} ${order.products.length > 1 ? `(+${order.products.length - 1})` : ''}`
          : 'Sem produtos'}
      </td>
      <td className="p-3">
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(order.commission || 0)}
      </td>
      <td className="p-3">
        <span
          className={`inline-flex items-center justify-center min-w-[90px] rounded-full px-3 py-1 text-xs ${getStatusTailwindClass(order.status)}`}
        >
          {order.status || 'Aguardando'}
        </span>
      </td>
      <td className="p-3">
        {order.created_at ? format(new Date(order.created_at), "dd/MM/yyyy") : '-'}
      </td>
      {children && (
        <td className="p-3">
          <div className="flex items-center justify-center">
            {children}
          </div>
        </td>
      )}
    </tr>
  );
};


import { format } from "date-fns";
import { LogzzOrder } from "@/hooks/useLogzzOrders";
import { Checkbox } from "@/components/ui/checkbox";

interface OrderRowProps {
  order: LogzzOrder;
  onOrderClick: (order: LogzzOrder) => void;
  getStatusColor: (status: string | null) => string;
  isSelected: boolean;
  onSelectOrder: (orderId: string, isSelected: boolean) => void;
}

export const OrderRow = ({ 
  order, 
  onOrderClick, 
  getStatusColor, 
  isSelected, 
  onSelectOrder 
}: OrderRowProps) => {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectOrder(order.order_number, !isSelected);
  };

  return (
    <tr 
      className="cursor-pointer border-b border-zinc-800 text-sm text-gray-300 transition-colors hover:bg-zinc-800"
      onClick={() => onOrderClick(order)}
    >
      <td className="p-3">
        <div onClick={handleCheckboxClick} className="flex items-center justify-center">
          <Checkbox 
            checked={isSelected}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-white"
          />
        </div>
      </td>
      <td className="p-3">{order.order_number}</td>
      <td className="p-3">{order.client_name}</td>
      <td className="p-3">
        {order.products?.[0]?.name || 'Sem produto'}
        {order.products?.length > 1 ? ` (+${order.products.length - 1})` : ''}
      </td>
      <td className="p-3">
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(order.commission || 0)}
      </td>
      <td className="p-3">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs ${getStatusColor(order.status)}`}
        >
          {order.status || 'Aguardando'}
        </span>
      </td>
      <td className="p-3">
        {order.created_at ? format(new Date(order.created_at), "dd/MM/yyyy") : '-'}
      </td>
    </tr>
  );
};

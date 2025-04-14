
import { Checkbox } from "@/components/ui/checkbox";

interface OrdersTableHeaderProps {
  onSelectAll: (selected: boolean) => void;
  allSelected: boolean;
  hasOrders: boolean;
}

export const OrdersTableHeader = ({ onSelectAll, allSelected, hasOrders }: OrdersTableHeaderProps) => {
  return (
    <tr className="border-b border-zinc-800 bg-dark-700 text-left text-sm text-gray-400">
      <th className="p-3 w-10">
        {hasOrders && (
          <div className="flex items-center justify-center">
            <Checkbox 
              checked={allSelected}
              onCheckedChange={onSelectAll} 
              className="data-[state=checked]:bg-primary data-[state=checked]:text-white"
            />
          </div>
        )}
      </th>
      <th className="p-3">PEDIDO</th>
      <th className="p-3">CLIENTE</th>
      <th className="p-3">PRODUTO</th>
      <th className="p-3">COMISSÃO</th>
      <th className="p-3">STATUS</th>
      <th className="p-3">DATA</th>
    </tr>
  );
};

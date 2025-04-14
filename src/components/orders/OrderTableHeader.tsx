import { OrderCheckbox } from "./OrderCheckbox";

interface OrderTableHeaderProps {
  allSelected: boolean;
  someSelected: boolean;
  onSelectAllVisible: (isSelected: boolean) => void;
}

export const OrderTableHeader = ({ 
  allSelected, 
  someSelected,
  onSelectAllVisible 
}: OrderTableHeaderProps) => {
  return (
    <tr className="border-b border-zinc-800 text-left text-sm text-gray-400">
      <th className="p-3 w-10">
        <OrderCheckbox 
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={onSelectAllVisible} 
        />
      </th>
      <th className="p-3">PEDIDO</th>
      <th className="p-3">CLIENTE</th>
      <th className="p-3">PRODUTO</th>
      <th className="p-3">COMISSÃO</th>
      <th className="p-3">STATUS</th>
      <th className="p-3">DATA</th>
      <th className="p-3 text-left text-xs text-gray-400 uppercase tracking-wider text-center">
        Ações
      </th>
    </tr>
  );
};

import { useState, useEffect } from "react";
import { LogzzOrder } from "@/hooks/useLogzzOrders";
import { OrderTableHeader } from "./OrderTableHeader";
import { OrderTableRow } from "./OrderTableRow";
import { OrderTablePagination } from "./OrderTablePagination";
import { updateOrderStatus } from "../../../ATUALIZACOES/metrics";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface OrdersTableProps {
  orders: LogzzOrder[];
  isLoading: boolean;
  selectedOrders: string[];
  onSelectOrder: (orderNumber: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  onSelectAllVisible: (orderNumbers: string[], isSelected: boolean) => void;
  onOrderUpdated?: () => void;
}

export const OrdersTable = ({ 
  orders, 
  isLoading,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onSelectAllVisible,
  onOrderUpdated
}: OrdersTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  useEffect(() => {
    setCurrentPage(1);
  }, [orders]);
  
  if (isLoading) {
    return (
      <div className="rounded-lg bg-dark-700 p-8 text-center border border-zinc-800">
        <p className="text-gray-400">Carregando pedidos...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-lg bg-dark-700 p-8 text-center border border-zinc-800">
        <p className="text-gray-400">Nenhum pedido encontrado</p>
      </div>
    );
  }

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
  
  const currentItems = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  
  const currentPageOrderNumbers = currentItems.map(order => order.order_number);

  const allCurrentPageSelected = currentPageOrderNumbers.length > 0 && 
    currentPageOrderNumbers.every(orderNumber => selectedOrders.includes(orderNumber));
  
  const someCurrentPageSelected = currentPageOrderNumbers.length > 0 && 
    currentPageOrderNumbers.some(orderNumber => selectedOrders.includes(orderNumber)) && 
    !allCurrentPageSelected;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectAllCurrentPage = (isSelected: boolean) => {
    onSelectAllVisible(currentPageOrderNumbers, isSelected);
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      const result = await updateOrderStatus(orderId, "Concluído");
      
      if (result.success) {
        toast.success("Pedido marcado como concluído com sucesso!");
        if (typeof onOrderUpdated === 'function') {
          onOrderUpdated();
        }
      } else {
        toast.error("Erro ao marcar pedido como concluído");
      }
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      toast.error("Ocorreu um erro ao atualizar o status do pedido");
    }
  };

  return (
    <div className="rounded-lg bg-dark-700 border border-zinc-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <OrderTableHeader 
              allSelected={allCurrentPageSelected}
              someSelected={someCurrentPageSelected}
              onSelectAllVisible={handleSelectAllCurrentPage}
            />
          </thead>
          <tbody>
            {currentItems.map((order) => (
              <OrderTableRow 
                key={order.order_number}
                order={order}
                isSelected={selectedOrders.includes(order.order_number)}
                onSelectOrder={onSelectOrder}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-green-500 hover:text-green-400 hover:bg-green-900/20"
                  onClick={() => handleCompleteOrder(order.id)}
                  title="Marcar como concluído"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </OrderTableRow>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <OrderTablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          totalItems={orders.length}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

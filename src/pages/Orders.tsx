import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLogzzOrders, OrderFilters } from "@/hooks/useLogzzOrders";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { OrdersTable } from "@/components/orders/OrdersTable"; 
import { Download, Trash2, Filter, CheckSquare, X, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdvancedFilters } from "@/components/orders/AdvancedFilters";
import DevLockOverlay from "@/components/DevLockOverlay";
import { updateOrderStatus } from "../../ATUALIZACOES/metrics";

const Orders = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<OrderFilters>({});
  const { data: orders = [], isLoading, refetch } = useLogzzOrders(filters);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompletingOrders, setIsCompletingOrders] = useState(false);
  
  const currentOrders = orders || [];

  useEffect(() => {
    setSelectedOrders([]);
  }, [orders]);

  const handleFilterChange = (newFilters: OrderFilters) => {
    setFilters(newFilters);
  };

  const handleExportOrders = () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "Nenhum pedido selecionado",
        description: "Selecione pelo menos um pedido para exportar.",
        variant: "destructive",
      });
      return;
    }

    const selectedOrdersData = currentOrders.filter(order => 
      selectedOrders.includes(order.order_number)
    );

    const csvRows = [];
    const headers = ["Pedido", "Cliente", "Produto", "Comissão", "Status", "Data"];
    csvRows.push(headers.join(","));

    selectedOrdersData.forEach(order => {
      const row = [
        order.order_number,
        order.client_name,
        order.products?.[0]?.name || 'Sem produto',
        order.commission || 0,
        order.status,
        order.created_at
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + csvString;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pedidos_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação concluída",
      description: `${selectedOrders.length} pedidos exportados com sucesso.`,
    });
  };

  const handleDeleteOrders = async () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "Nenhum pedido selecionado",
        description: "Selecione pelo menos um pedido para deletar.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteOrders = async () => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('logzz_orders')
        .delete()
        .in('order_number', selectedOrders);

      if (error) {
        throw error;
      }

      toast({
        title: "Pedidos deletados",
        description: `${selectedOrders.length} pedidos foram removidos com sucesso.`,
      });

      setSelectedOrders([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting orders:', error);
      toast({
        title: "Erro ao deletar pedidos",
        description: "Ocorreu um erro ao tentar deletar os pedidos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectOrder = (orderNumber: string, isSelected: boolean) => {
    setSelectedOrders(prev => {
      if (isSelected) {
        return prev.includes(orderNumber) ? prev : [...prev, orderNumber];
      } else {
        return prev.filter(id => id !== orderNumber);
      }
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allOrderNumbers = currentOrders.map(order => order.order_number);
      setSelectedOrders(allOrderNumbers);
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectAllVisible = (orderNumbers: string[], isSelected: boolean) => {
    setSelectedOrders(prev => {
      if (isSelected) {
        const newSelection = [...prev];
        orderNumbers.forEach(orderNumber => {
          if (!newSelection.includes(orderNumber)) {
            newSelection.push(orderNumber);
          }
        });
        return newSelection;
      } else {
        return prev.filter(orderNumber => !orderNumbers.includes(orderNumber));
      }
    });
  };

  const handleDeselectAll = () => {
    setSelectedOrders([]);
  };

  const handleCompleteOrders = async () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "Nenhum pedido selecionado",
        description: "Selecione pelo menos um pedido para marcar como concluído.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCompletingOrders(true);
      
      // Processa cada pedido selecionado em sequência
      const results = await Promise.all(
        selectedOrders.map(async (orderNumber) => {
          const order = currentOrders.find(o => o.order_number === orderNumber);
          if (!order) return { success: false, orderNumber };
          
          const result = await updateOrderStatus(order.id, "Concluído");
          return { ...result, orderNumber };
        })
      );
      
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      if (successful > 0) {
        toast({
          title: `${successful} pedidos atualizados`,
          description: "Os pedidos foram marcados como concluídos com sucesso.",
        });
        
        // Recarregar a lista de pedidos
        refetch();
      }
      
      if (failed > 0) {
        toast({
          title: `Falha em ${failed} pedidos`,
          description: "Alguns pedidos não puderam ser atualizados. Tente novamente.",
          variant: "destructive",
        });
      }
      
      setSelectedOrders([]);
    } catch (error) {
      console.error('Erro ao completar pedidos:', error);
      toast({
        title: "Erro ao atualizar pedidos",
        description: "Ocorreu um erro ao tentar marcar os pedidos como concluídos.",
        variant: "destructive",
      });
    } finally {
      setIsCompletingOrders(false);
    }
  };

  const renderSelectionActions = () => {
    if (selectedOrders.length === 0) return null;

    return (
      <div className="flex items-center gap-2 mb-4 p-3 bg-zinc-800 rounded-md border border-zinc-700">
        <span className="text-sm text-gray-300">
          {selectedOrders.length} {selectedOrders.length === 1 ? 'pedido selecionado' : 'pedidos selecionados'}
        </span>
        {selectedOrders.length < currentOrders.length && (
          <Button 
            onClick={() => handleSelectAll(true)}
            variant="outline" 
            size="sm"
            className="border-zinc-700 text-primary hover:bg-zinc-800/80 hover:text-primary-light"
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Selecionar todos
          </Button>
        )}
        <Button 
          onClick={handleDeselectAll}
          variant="outline" 
          size="sm"
          className="border-zinc-700 text-primary hover:bg-zinc-800/80 hover:text-primary-light"
        >
          <X className="h-4 w-4 mr-2" />
          Deselecionar todos
        </Button>
        <Button 
          onClick={handleExportOrders}
          variant="outline" 
          size="sm"
          className="border-zinc-700 text-primary hover:bg-zinc-800/80 hover:text-primary-light"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
        <Button 
          onClick={handleCompleteOrders}
          variant="outline" 
          size="sm"
          disabled={isCompletingOrders}
          className="border-green-800 text-green-500 hover:bg-green-900/20"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {isCompletingOrders ? "Processando..." : "Marcar como concluído"}
        </Button>
        <Button 
          onClick={handleDeleteOrders}
          variant="outline" 
          size="sm"
          className="border-red-800 text-red-500 hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Deletar
        </Button>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Pedidos</h1>
        <div className="flex gap-2">
          <AdvancedFilters 
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </div>
      </div>

      <div className="relative">
        {renderSelectionActions()}

        <div className="bg-dark-700 rounded-lg border border-zinc-800">
          <OrdersTable 
            orders={currentOrders}
            isLoading={isLoading}
            selectedOrders={selectedOrders}
            onSelectOrder={handleSelectOrder}
            onSelectAll={handleSelectAll}
            onSelectAllVisible={handleSelectAllVisible}
            onOrderUpdated={refetch}
          />
        </div>

        <DevLockOverlay message="Módulo em desenvolvimento" />
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-dark-700 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmar exclusão</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Você está prestes a deletar {selectedOrders.length} {selectedOrders.length === 1 ? 'pedido' : 'pedidos'}. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-zinc-700 text-white hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDeleteOrders}
              disabled={isDeleting}
            >
              {isDeleting ? "Deletando..." : "Deletar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;

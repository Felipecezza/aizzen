import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface OrderTimelineItem {
  status: string;
  date: string | null;
  time: string | null;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface OrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    scheduledDate: string;
    items: OrderItem[];
    customer: OrderCustomer;
    payment: {
      total: number;
      netValue: number;
    };
    operator: string;
    timeline: OrderTimelineItem[];
  } | null;
}

export const OrderDetails = ({ isOpen, onClose, order }: OrderDetailsProps) => {
  if (!order) return null;

  const getTimelineColor = (status: string, currentStatus: string) => {
    // Define a ordem cronológica dos status
    const statusOrder = ["Agendado", "Separado", "Em Rota", "Entregue", "Completo", "Frustrado"];
    const statusIndex = statusOrder.indexOf(status);
    const currentStatusIndex = statusOrder.indexOf(currentStatus);

    // Se o pedido estiver frustrado
    if (currentStatus === "Frustrado") {
      return status === "Frustrado" ? "bg-red-500" : "bg-zinc-700";
    }

    // Tratar "Completo" como "Entregue"
    const normalizedCurrentStatus = currentStatus === "Completo" ? "Entregue" : currentStatus;
    const normalizedStatusIndex = statusOrder.indexOf(normalizedCurrentStatus);

    // Para pedidos não frustrados, as bolinhas ficam verdes até o status atual
    return statusIndex <= normalizedStatusIndex ? "bg-[#10c38b]" : "bg-zinc-700";
  };

  // Encontra o status atual do pedido (último status com data)
  const getCurrentStatus = (timeline: OrderTimelineItem[]) => {
    const lastStatusWithDate = [...timeline]
      .reverse()
      .find(item => item.date !== null);
    return lastStatusWithDate?.status || timeline[0].status;
  };

  const currentStatus = getCurrentStatus(order.timeline);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-zinc-950 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>Detalhes do pedido: {order.id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">Resumo do pedido</h3>
            <div className="space-y-4">
              <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
                <p className="mb-2 font-medium">Entrega Agendada</p>
                <p className="text-sm text-gray-400">
                  Sua entrega foi agendada para dia {order.scheduledDate}
                </p>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                {order.timeline.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className={cn(
                      "mb-2 h-2 w-2 mx-auto rounded-full",
                      getTimelineColor(step.status, currentStatus)
                    )} />
                    <p className="text-sm font-medium">{step.status}</p>
                    <p className="text-xs text-gray-400">
                      {step.date || "Sem previsão"}
                    </p>
                    <p className="text-xs text-gray-400">{step.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Itens do pedido</h3>
            <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400">
                    <th className="p-2">Produtos</th>
                    <th className="p-2">Quantidade</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-t border-zinc-800">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">x{item.quantity}</td>
                      <td className="p-2">
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="mb-4 text-lg font-medium">Dados do cliente</h3>
              <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm text-gray-400">{order.customer.phone}</p>
                <p className="text-sm text-gray-400">{order.customer.address}</p>
                <p className="text-sm text-gray-400">
                  {order.customer.city} / {order.customer.state}
                </p>
                <p className="text-sm text-gray-400">{order.customer.zipCode}</p>
              </div>
            </div>
            
            <div>
              <h3 className="mb-4 text-lg font-medium">Detalhes</h3>
              <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-400">Operador</p>
                  <p className="font-medium">{order.operator}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-400">Valor Total</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(order.payment.total)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Valor Líquido</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(order.payment.netValue)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
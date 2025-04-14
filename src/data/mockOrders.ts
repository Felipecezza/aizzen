export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  items: OrderItem[];
  status: 'Pendente' | 'Em Processamento' | 'Concluído' | 'Cancelado';
  total: number;
  created_at: string;
  updated_at: string;
}

export const mockOrders: Order[] = [
  {
    id: '1',
    customer: 'João Silva',
    items: [
      { id: '1', name: 'Produto A', quantity: 2, price: 100 },
      { id: '2', name: 'Produto B', quantity: 1, price: 150 }
    ],
    status: 'Pendente',
    total: 350,
    created_at: '2024-02-20T10:00:00Z',
    updated_at: '2024-02-20T10:00:00Z'
  },
  {
    id: '2',
    customer: 'Maria Santos',
    items: [
      { id: '3', name: 'Produto C', quantity: 3, price: 200 }
    ],
    status: 'Concluído',
    total: 600,
    created_at: '2024-02-19T15:30:00Z',
    updated_at: '2024-02-20T09:00:00Z'
  }
];
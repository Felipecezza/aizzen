export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items: OrderItem[];
  user_id: string;
}

export const mockOrders: Order[] = [
  {
    id: '1',
    created_at: '2024-01-01T10:00:00Z',
    status: 'Concluído',
    total: 150.00,
    items: [
      { id: '1', name: 'Produto A', quantity: 2, price: 50.00 },
      { id: '2', name: 'Produto B', quantity: 1, price: 50.00 }
    ],
    user_id: 'user1'
  },
  {
    id: '2',
    created_at: '2024-01-02T11:00:00Z',
    status: 'Pendente',
    total: 200.00,
    items: [
      { id: '3', name: 'Produto C', quantity: 1, price: 200.00 }
    ],
    user_id: 'user1'
  }
]; 
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Table {
  id: string;
  number: number;
  status: 'available' | 'occupied' | 'billing';
  customerId?: string;
  customerName?: string;
  items: OrderItem[];
  createdAt: Date;
  total: number;
}

export interface Bill {
  id: string;
  tableId: string;
  tableNumber: number;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
  paymentStatus: 'pending' | 'paid';
}
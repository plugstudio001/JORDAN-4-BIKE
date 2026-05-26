export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
  category: string;
  barcode: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type TransactionItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

export type Transaction = {
  id: string;
  customerId?: string;
  employeeId: string;
  items: TransactionItem[];
  totalAmount: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'refunded';
  timestamp: string;
};

export type Employee = {
  id: string;
  userId?: string;
  name: string;
  email: string;
  role: string;
  salary: number;
  status: 'active' | 'inactive';
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
};

export type Campaign = {
  id: string;
  name: string;
  type: 'sms' | 'email' | 'social';
  content: string;
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
};

export type DashboardStats = {
  revenue: number;
  orders: number;
  activeCustomers: number;
  employeeActivity: number;
  lowStockAlerts: number;
};

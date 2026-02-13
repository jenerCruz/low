
export type Status = 'Pending' | 'In Production' | 'Finished' | 'Shipped' | 'Cancelled';

export interface RugDesign {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  basePriceUSD: number;
  description: string;
  colors: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  currency: 'MXN' | 'USD';
  category: 'Wool' | 'Dye' | 'Base' | 'Tools';
}

export interface ProductionItem {
  id: string;
  designId: string;
  orderId?: string;
  startDate: string;
  estimatedEndDate: string;
  status: 'Design' | 'Warping' | 'Weaving' | 'Finishing' | 'Quality Control';
  progress: number;
  assignedTo: string;
}

export interface Order {
  id: string;
  customerName: string;
  contact: string;
  items: {
    designId: string;
    width: number;
    height: number;
    price: number;
    currency: 'MXN' | 'USD';
  }[];
  total: number;
  status: Status;
  orderDate: string;
  deadline: string;
  shippingInfo?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  category: 'General' | 'Production' | 'Inventory' | 'Sales';
}

export interface AppNote {
  id: string;
  content: string;
  updatedAt: string;
  color: string;
}

export interface DashboardWidget {
  id: string;
  type: 'search' | 'orders' | 'inventory' | 'stats' | 'tasks' | 'mail' | 'browser';
  visible: boolean;
  title: string;
}

export interface DriveConfig {
  accessToken?: string;
  userEmail?: string;
  lastSyncTime?: string;
  isAutoSyncEnabled: boolean;
  fileId?: string;
}

export interface AppState {
  designs: RugDesign[];
  inventory: InventoryItem[];
  production: ProductionItem[];
  orders: Order[];
  tasks: Task[];
  notes: AppNote[];
  usdExchangeRate: number;
  dashboardConfig: DashboardWidget[];
  driveConfig: DriveConfig;
  lastSync?: string;
  isSyncing: boolean;
}

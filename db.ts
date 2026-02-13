
import { AppState } from './types';

const STORAGE_KEY = 'low_dain_data_v4';

export const initialData: AppState = {
  designs: [
    {
      id: '1',
      name: 'Oaxaca Sunrise',
      category: 'Geometric',
      imageUrl: 'https://picsum.photos/seed/rug1/400/400',
      basePriceUSD: 250,
      description: 'Traditional Zapotec patterns in earth tones.',
      colors: ['#8B4513', '#F5F5DC', '#2F4F4F']
    }
  ],
  inventory: [
    { id: '1', name: 'Lana Merino - Natural', quantity: 8, unit: 'kg', costPerUnit: 450, currency: 'MXN', category: 'Wool' },
    { id: '2', name: 'Tinte Indigo', quantity: 5, unit: 'L', costPerUnit: 800, currency: 'MXN', category: 'Dye' }
  ],
  production: [
    { id: 'p1', designId: '1', startDate: '2024-05-10', estimatedEndDate: '2024-06-15', status: 'Weaving', progress: 45, assignedTo: 'Juan M.' }
  ],
  orders: [
    {
      id: 'o1',
      customerName: 'Elena Rodríguez',
      contact: 'elena@email.com',
      items: [{ designId: '1', width: 1.2, height: 1.8, price: 350, currency: 'USD' }],
      total: 350,
      status: 'Pending',
      orderDate: '2024-05-15',
      deadline: '2024-06-20'
    }
  ],
  tasks: [
    { id: 't1', title: 'Comprar lana crema extra', description: 'Urgente', dueDate: '2024-05-20', priority: 'High', completed: false, category: 'Inventory' }
  ],
  notes: [],
  usdExchangeRate: 18.50,
  dashboardConfig: [
    { id: 'w1', type: 'search', visible: true, title: 'Buscador' },
    { id: 'w2', type: 'orders', visible: true, title: 'Próximas Entregas' },
    { id: 'w3', type: 'inventory', visible: true, title: 'Stock Crítico' },
    { id: 'w4', type: 'tasks', visible: true, title: 'Pendientes' },
    { id: 'w5', type: 'stats', visible: true, title: 'Rendimiento' },
    { id: 'w6', type: 'mail', visible: true, title: 'Correo' },
    { id: 'w7', type: 'browser', visible: true, title: 'Navegador' }
  ],
  driveConfig: {
    isAutoSyncEnabled: false
  },
  isSyncing: false,
  lastSync: new Date().toISOString()
};

export const loadData = (): AppState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (!parsed.notes) parsed.notes = [];
      if (!parsed.driveConfig) parsed.driveConfig = initialData.driveConfig;
      return parsed;
    } catch (e) {
      console.error('Error cargando DB', e);
    }
  }
  return initialData;
};

export const saveData = (data: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

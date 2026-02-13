
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Package, Hammer, ShoppingBag, Palette, 
  Settings, Menu, X, FileText, Table as TableIcon, CheckSquare,
  Mail, Globe, Bell, Download, Cloud, RefreshCw,
  LogOut, Check
} from 'lucide-react';
import { loadData, saveData } from './db';
import { AppState } from './types';

import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Production from './components/Production';
import Orders from './components/Orders';
import Designs from './components/Designs';
import TasksView from './components/TasksView';
import Catalog from './components/Catalog';
import SheetsModule from './components/SheetsModule';
import WebResources from './components/WebResources';

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(loadData());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const syncTimeoutRef = useRef<number | null>(null);

  // Fix: Ensure side effects for saving and auto-syncing are handled correctly.
  useEffect(() => {
    saveData(state);
    if (state.driveConfig.accessToken && state.driveConfig.isAutoSyncEnabled) {
      if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = window.setTimeout(() => handleCloudSync(), 5000);
    }
  }, [state]);

  const updateState = (updater: (prev: AppState) => AppState) => setState(prev => updater(prev));

  // Fix: Global CSV export functionality for all major data sections.
  const handleGlobalExport = () => {
    const sections = [
      { name: 'INVENTARIO', data: state.inventory },
      { name: 'PEDIDOS', data: state.orders },
      { name: 'TAREAS', data: state.tasks },
      { name: 'PRODUCCION', data: state.production },
      { name: 'NOTAS', data: state.notes }
    ];
    let csvContent = "data:text/csv;charset=utf-8,";
    sections.forEach(sec => {
      csvContent += `\n--- ${sec.name} ---\n`;
      if (sec.data.length > 0) {
        const headers = Object.keys(sec.data[0]);
        csvContent += headers.join(",") + "\n";
        sec.data.forEach((row: any) => {
          csvContent += headers.map(h => `"${row[h] || ''}"`).join(",") + "\n";
        });
      }
    });
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `LowDain_Backup_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fix: Implementation of cloud synchronization with Google Drive.
  const handleCloudSync = async () => {
    if (!state.driveConfig.accessToken) { setIsDriveModalOpen(true); return; }
    setSyncStatus('syncing');
    try {
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.driveConfig.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...state, driveConfig: { ...state.driveConfig, accessToken: undefined } })
      });
      if (!response.ok) throw new Error('Sync failed');
      setSyncStatus('success');
      updateState(prev => ({ ...prev, isSyncing: false, lastSync: new Date().toISOString() }));
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err) {
      setSyncStatus('error');
    }
  };

  const initGoogleAuth = () => {
    // @ts-ignore
    const client = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response: any) => {
        if (response.access_token) {
          updateState(prev => ({ ...prev, driveConfig: { ...prev.driveConfig, accessToken: response.access_token, lastSyncTime: new Date().toISOString() } }));
          setIsDriveModalOpen(false);
          handleCloudSync();
        }
      },
    });
    client.requestAccessToken();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventario', icon: Package, badge: state.inventory.filter(i => i.quantity < 10).length },
    { id: 'production', label: 'Producción', icon: Hammer },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
    { id: 'designs', label: 'Diseños', icon: Palette },
    { id: 'catalog', label: 'Catálogo', icon: FileText },
    { id: 'tasks', label: 'Tareas & Notas', icon: CheckSquare, badge: state.tasks.filter(t => !t.completed).length },
    { id: 'sheets', label: 'Tablas Maestras', icon: TableIcon },
    { id: 'mail', label: 'Correo', icon: Mail },
    { id: 'browser', label: 'Explorador', icon: Globe },
  ];

  return (
    <div className="flex h-screen bg-[#FAFAFA] text-[#1A1A1A] overflow-hidden">
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 ${isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'} bg-white border-r border-[#D1D5D8] transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between shrink-0">
          <h1 className={`text-xl font-bold serif tracking-tight transition-opacity duration-300 ${!isSidebarOpen && 'lg:opacity-0'}`}>
            Low <span className="text-[#ff0071]">Dain</span>
          </h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-[#F5F5F5] rounded-md transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group ${activeTab === item.id ? 'bg-[#ff0071] text-white shadow-lg accent-glow' : 'hover:bg-[#F5F5F5] text-[#666]'}`}
            >
              <item.icon size={20} className="shrink-0" />
              <span className={`text-sm font-semibold whitespace-nowrap ${!isSidebarOpen && 'lg:hidden'}`}>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className={`absolute ${isSidebarOpen ? 'right-3' : 'right-1 top-1'} flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white ring-2 ring-white`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#D1D5D8] bg-[#F5F5F5]/50 space-y-2">
          <button 
            onClick={() => setIsDriveModalOpen(true)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${state.driveConfig.accessToken ? 'text-emerald-600 bg-emerald-50' : 'text-[#666] hover:bg-white'}`}
          >
            <Cloud size={14} className={syncStatus === 'syncing' ? 'animate-pulse' : ''} />
            {isSidebarOpen && <span>{state.driveConfig.accessToken ? 'Cloud Activo' : 'Drive Connect'}</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white border-b border-[#D1D5D8] flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2"><Menu size={20} /></button>
            <h2 className="text-sm md:text-lg font-bold serif uppercase tracking-widest">{menuItems.find(m => m.id === activeTab)?.label}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
                <span className="text-[9px] font-bold uppercase text-[#999] tracking-widest">Sincronización</span>
                <span className="text-[10px] font-bold text-[#333]">
                    {state.lastSync ? new Date(state.lastSync).toLocaleTimeString() : 'Local Only'}
                </span>
            </div>
            <button 
                onClick={handleCloudSync}
                className={`p-2 rounded-xl border transition-all ${syncStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'hover:bg-[#F5F5F5] text-[#666]'}`}
            >
              {syncStatus === 'syncing' ? <RefreshCw className="animate-spin" size={20} /> : syncStatus === 'success' ? <Check size={20} /> : <RefreshCw size={20} />}
            </button>
            <button onClick={handleGlobalExport} className="p-2 hover:bg-[#F5F5F5] rounded-xl text-[#666] border border-[#D1D5D8]">
              <Download size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {activeTab === 'dashboard' && <Dashboard state={state} updateState={updateState} setActiveTab={setActiveTab} />}
            {activeTab === 'inventory' && <Inventory state={state} updateState={updateState} />}
            {activeTab === 'production' && <Production state={state} updateState={updateState} />}
            {activeTab === 'orders' && <Orders state={state} updateState={updateState} />}
            {activeTab === 'designs' && <Designs state={state} updateState={updateState} />}
            {activeTab === 'catalog' && <Catalog state={state} updateState={updateState} />}
            {activeTab === 'tasks' && <TasksView state={state} updateState={updateState} />}
            {activeTab === 'sheets' && <SheetsModule state={state} updateState={updateState} />}
            {activeTab === 'mail' && <WebResources type="mail" />}
            {activeTab === 'browser' && <WebResources type="browser" />}
        </div>
      </main>

      {isDriveModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full border border-[#D1D5D8] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-[#F9FAFB] rounded-2xl text-[#ff0071] border border-[#D1D5D8]"><Cloud size={32} /></div>
              <button onClick={() => setIsDriveModalOpen(false)} className="p-2 hover:bg-[#F5F5F5] rounded-full text-[#999]"><X size={20} /></button>
            </div>
            <h3 className="text-xl font-bold serif mb-2">Google Drive Sync</h3>
            <p className="text-sm text-[#666] mb-8 leading-relaxed">Conecta tu cuenta para respaldar inventario, pedidos y cronogramas en la nube automáticamente.</p>
            <button 
              onClick={initGoogleAuth}
              className="w-full py-4 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#ff0071] transition-all flex items-center justify-center gap-3 shadow-lg accent-glow"
            >
              Conectar Ahora <RefreshCw size={16} />
            </button>
            <p className="text-[10px] text-center text-[#999] mt-6 font-bold uppercase tracking-widest">Seguro y Encriptado</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

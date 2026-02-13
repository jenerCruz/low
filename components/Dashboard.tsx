
import React, { useState } from 'react';
import { AppState, DashboardWidget } from '../types';
import { 
  Plus, TrendingDown, TrendingUp, Calendar, ListTodo, ChevronRight, 
  ShoppingBag, Zap, X, Mail, Globe, Search as SearchIcon, ArrowRight, Settings2, Eye, EyeOff
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<Props> = ({ state, updateState, setActiveTab }) => {
  const [showQuickAdd, setShowQuickAdd] = useState<'task' | 'inventory' | 'order' | null>(null);
  const [isEditingLayout, setIsEditingLayout] = useState(false);

  const criticalStock = state.inventory.filter(i => i.quantity < 10);
  const upcomingOrders = state.orders.filter(o => o.status === 'Pending');
  const pendingTasks = state.tasks.filter(t => !t.completed);

  const toggleWidget = (id: string) => {
    updateState(prev => ({
      ...prev,
      dashboardConfig: prev.dashboardConfig.map(w => w.id === id ? { ...w, visible: !w.visible } : w)
    }));
  };

  const isVisible = (type: DashboardWidget['type']) => {
    return state.dashboardConfig.find(w => w.type === type)?.visible;
  };

  return (
    <div className="relative space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold serif text-[#1A1A1A]">Estudio Low <span className="text-[#ff0071]">Dain</span></h2>
          <p className="text-[10px] text-[#999] font-bold uppercase tracking-[0.3em] mt-1">
            Producción Artesanal • {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 md:gap-3 w-full lg:w-auto">
          <button 
            onClick={() => setIsEditingLayout(!isEditingLayout)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-bold border transition-all ${isEditingLayout ? 'bg-[#ff0071] text-white border-[#ff0071] accent-glow' : 'bg-white text-[#666] border-[#D1D5D8] hover:border-[#ff0071]'}`}
          >
            <Settings2 size={16} />
            <span>{isEditingLayout ? 'Cerrar Edición' : 'Personalizar'}</span>
          </button>
          
          <button
            onClick={() => setShowQuickAdd('order')}
            className="bg-black text-white flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold shadow-sm hover:bg-[#ff0071] transition-all group"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform" />
            <span>Registro Rápido</span>
          </button>
        </div>
      </div>

      {/* EDIT MODE PANEL */}
      {isEditingLayout && (
        <div className="bg-[#F5F5F5] p-6 rounded-[2rem] border-2 border-dashed border-[#D1D5D8] animate-in slide-in-from-top-4">
           <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-[#999]">Visibilidad de Módulos</h4>
           <div className="flex flex-wrap gap-2">
              {state.dashboardConfig.map(w => (
                <button 
                  key={w.id}
                  onClick={() => toggleWidget(w.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${w.visible ? 'bg-black text-white' : 'bg-white text-[#999] border border-[#D1D5D8]'}`}
                >
                  {w.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                  {w.title}
                </button>
              ))}
           </div>
        </div>
      )}

      {/* DYNAMIC BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {isVisible('search') && (
          <div className="md:col-span-2 vintage-card p-4 rounded-2xl flex items-center gap-4 bg-white">
             <div className="p-3 bg-[#F9FAFB] rounded-xl text-[#ff0071] border border-[#D1D5D8]"><SearchIcon size={20} /></div>
             <div className="flex-1">
                <input 
                  onClick={() => setActiveTab('browser')}
                  placeholder="Inspiración, materiales, tendencias..." 
                  className="w-full bg-transparent border-none outline-none text-base font-medium serif"
                />
                <p className="text-[9px] font-bold uppercase text-[#999] tracking-widest">Global Search Context</p>
             </div>
             <button onClick={() => setActiveTab('browser')} className="p-2 hover:bg-[#F5F5F5] rounded-full transition-colors"><ArrowRight size={18} /></button>
          </div>
        )}

        {isVisible('mail') && (
          <div onClick={() => setActiveTab('mail')} className="vintage-card p-6 rounded-[2rem] flex flex-col justify-between cursor-pointer hover:border-[#ff0071] group relative">
            <Mail size={22} className="text-[#999] group-hover:text-[#ff0071] transition-colors" />
            <div>
              <p className="text-xl font-bold serif">Inbox</p>
              <p className="text-[9px] font-bold uppercase text-[#999]">Correo del Taller</p>
            </div>
            <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-[#ff0071] rounded-full accent-glow"></div>
          </div>
        )}

        {isVisible('tasks') && (
          <div onClick={() => setActiveTab('tasks')} className="vintage-card p-6 rounded-[2rem] flex flex-col justify-between cursor-pointer hover:bg-[#F9FAFB] group">
            <div className="flex justify-between items-start">
               <ListTodo size={22} className="text-[#999] group-hover:text-black transition-colors" />
               <span className="text-2xl font-bold serif text-[#ff0071]">{pendingTasks.length}</span>
            </div>
            <div>
              <p className="text-sm font-bold uppercase">Tareas</p>
              <p className="text-[9px] font-bold text-[#999]">Pendientes Críticos</p>
            </div>
          </div>
        )}

        {isVisible('orders') && (
          <div className="md:col-span-2 md:row-span-2 bg-white text-black p-8 rounded-[2.5rem] border border-[#D1D5D8] flex flex-col relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-[#F9FAFB] border border-[#D1D5D8] rounded-2xl group-hover:border-[#ff0071] transition-colors">
                  <Calendar className="text-[#ff0071]" size={24} />
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#999]">En Producción</span>
                  <span className="text-[10px] font-bold bg-black text-white px-3 py-1 rounded-full mt-2 inline-block">Cronograma Activo</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold serif mb-6">Próximas Entregas</h3>
              <div className="flex-1 space-y-3">
                {upcomingOrders.length > 0 ? upcomingOrders.slice(0, 3).map(o => (
                  <div key={o.id} className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-xl hover:bg-white border border-transparent hover:border-[#D1D5D8] transition-all">
                    <div>
                      <p className="font-bold text-sm">{o.customerName}</p>
                      <p className="text-[10px] text-[#ff0071] font-bold">{o.deadline}</p>
                    </div>
                    <ChevronRight size={14} className="text-[#D1D5D8]" />
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-32 text-[#D1D5D8] italic text-xs">Sin pedidos urgentes</div>
                )}
              </div>
            </div>
            <Zap className="absolute -bottom-10 -right-10 text-[#F5F5F5] w-64 h-64 rotate-12" />
          </div>
        )}

        {isVisible('inventory') && (
          <div className="md:row-span-2 vintage-card p-7 rounded-[2.5rem] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold serif text-[#1A1A1A]">Insumos Bajos</h3>
              <TrendingDown size={18} className="text-rose-500" />
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
              {criticalStock.map(item => (
                <div key={item.id} className="group">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-xs font-bold truncate pr-2">{item.name}</p>
                    <span className="text-[10px] font-bold text-[#ff0071]">{item.quantity} {item.unit}</span>
                  </div>
                  <div className="w-full bg-[#F5F5F5] h-1 rounded-full overflow-hidden">
                    <div className="bg-[#ff0071] h-full transition-all" style={{ width: `${Math.max(5, (item.quantity / 50) * 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveTab('inventory')} className="mt-6 w-full py-3 bg-[#F5F5F5] text-[#666] border border-[#D1D5D8] rounded-xl text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-all">
              Gestionar Stock
            </button>
          </div>
        )}

        {isVisible('stats') && (
          <div className="md:col-span-2 vintage-card p-8 rounded-[2.5rem] flex flex-col justify-between bg-white border border-[#D1D5D8]">
             <div className="flex justify-between items-center mb-4">
                <div>
                   <p className="text-[9px] font-bold uppercase text-[#999] tracking-widest">Rendimiento Semanal</p>
                   <h4 className="text-xl font-bold serif">Producción</h4>
                </div>
                <div className="p-3 bg-[#F9FAFB] text-emerald-500 rounded-xl border border-[#D1D5D8]"><TrendingUp size={20} /></div>
             </div>
             <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{n:'L',v:2},{n:'M',v:5},{n:'M',v:3},{n:'J',v:8},{n:'V',v:6}]}>
                    <Bar dataKey="v" radius={[4,4,4,4]} barSize={24}>
                      {[{n:'L',v:2},{n:'M',v:5},{n:'M',v:3},{n:'J',v:8},{n:'V',v:6}].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? '#ff0071' : '#F5F5F5'} stroke={index === 3 ? 'none' : '#D1D5D8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        )}

        {isVisible('browser') && (
          <div onClick={() => setActiveTab('browser')} className="vintage-card p-6 rounded-[2rem] flex flex-row items-center justify-between hover:border-[#ff0071] cursor-pointer group transition-all">
             <div className="p-3 bg-[#F9FAFB] border border-[#D1D5D8] rounded-xl group-hover:bg-[#ff0071] group-hover:text-white transition-all">
                <Globe size={18} />
             </div>
             <div className="text-right">
                <p className="text-base font-bold serif">Web Explorer</p>
                <p className="text-[9px] font-bold uppercase text-[#999]">Tendencias 2025</p>
             </div>
          </div>
        )}

      </div>

      {/* QUICK ADD MODAL */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full border border-[#D1D5D8] shadow-2xl relative">
            <button onClick={() => setShowQuickAdd(null)} className="absolute top-8 right-8 p-2 hover:bg-[#F5F5F5] rounded-full text-[#999]"><X size={20} /></button>
            <div className="flex items-center gap-5 mb-8">
              <div className="p-4 bg-[#F9FAFB] border border-[#D1D5D8] rounded-2xl text-[#ff0071]"><ShoppingBag size={24} /></div>
              <div>
                <h3 className="text-2xl font-bold serif text-black">Añadir Nota</h3>
                <p className="text-[10px] text-[#999] font-bold uppercase tracking-widest mt-1">Registro Maestro en Drive</p>
              </div>
            </div>
            <textarea className="w-full p-6 bg-[#F9FAFB] border border-[#D1D5D8] rounded-2xl outline-none text-sm font-medium h-32 mb-6" placeholder="Escribe detalles rápidos..."></textarea>
            <button onClick={() => setShowQuickAdd(null)} className="w-full py-4 bg-black text-white rounded-xl text-sm font-bold shadow-lg hover:bg-[#ff0071] transition-all">Guardar en Base de Datos</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

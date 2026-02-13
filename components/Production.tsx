import React from 'react';
import { AppState } from '../types';
import { Hammer, Clock, User, Plus, Info } from 'lucide-react';

interface Props {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const Production: React.FC<Props> = ({ state, updateState }) => {
  const statusColors: Record<string, string> = {
    'Design': 'bg-[#F5F5F5] text-[#666] border-[#D1D5D8]',
    'Warping': 'bg-white text-[#ff0071] border-[#ff0071]',
    'Weaving': 'bg-black text-white border-black',
    'Finishing': 'bg-[#F9FAFB] text-[#1A1A1A] border-[#D1D5D8]',
    'Quality Control': 'bg-emerald-50 text-emerald-600 border-emerald-200'
  };

  const handleProgress = (id: string, newProgress: number) => {
    updateState(prev => ({
      ...prev,
      production: prev.production.map(p => 
        p.id === id ? { ...p, progress: Math.min(100, Math.max(0, newProgress)) } : p
      )
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold serif">Control de Producción</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#999] mt-1">Monitoreo de telares activos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Design', 'Warping', 'Weaving', 'Finishing', 'Quality Control'].map(s => (
            <span key={s} className="px-3 py-1 text-[9px] font-bold uppercase rounded-lg bg-white border border-[#D1D5D8] text-[#666]">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {state.production.map((item) => {
          const design = state.designs.find(d => d.id === item.designId);
          return (
            <div key={item.id} className="vintage-card rounded-[2.5rem] p-7 flex flex-col group border-[#D1D5D8]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-bold text-lg serif group-hover:text-[#ff0071] transition-colors">{design?.name}</h4>
                  <p className="text-[10px] font-bold uppercase text-[#999] tracking-widest">Iniciado: {item.startDate}</p>
                </div>
                <span className={`px-3 py-1 text-[9px] font-bold uppercase rounded-full border ${statusColors[item.status]}`}>
                  {item.status}
                </span>
              </div>

              <div className="aspect-square w-full rounded-[2rem] overflow-hidden mb-6 bg-[#F5F5F5] border border-[#D1D5D8]">
                <img src={design?.imageUrl} alt={design?.name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-[#999]">Estado de Avance</span>
                    <span className="text-[#ff0071]">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-[#F5F5F5] h-1.5 rounded-full overflow-hidden border border-[#D1D5D8]/30">
                    <div className="bg-[#ff0071] h-full transition-all duration-700 accent-glow" style={{width: `${item.progress}%`}}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter text-[#666] pt-2 border-t border-[#F5F5F5]">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-[#ff0071]" />
                    <span>{item.assignedTo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>Entrega: {item.estimatedEndDate}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => handleProgress(item.id, item.progress - 5)}
                    className="flex-1 py-3 text-[10px] font-bold uppercase border border-[#D1D5D8] rounded-xl hover:bg-[#F5F5F5] transition-all"
                  >
                    Retroceder
                  </button>
                  <button 
                    onClick={() => handleProgress(item.id, item.progress + 5)}
                    className="flex-1 py-3 text-[10px] font-bold uppercase bg-black text-white rounded-xl hover:bg-[#ff0071] transition-all"
                  >
                    Avanzar
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <button className="border-2 border-dashed border-[#D1D5D8] rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 text-[#999] hover:bg-white hover:border-[#ff0071] hover:text-[#ff0071] transition-all group">
          <div className="p-5 bg-[#F5F5F5] rounded-[1.5rem] group-hover:bg-[#ff0071] group-hover:text-white transition-all">
            <Plus size={32} />
          </div>
          <span className="font-bold serif text-lg">Montar Nuevo Telar</span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-center max-w-[150px]">Registrar orden en cola de producción</p>
        </button>
      </div>

      <div className="bg-black text-white p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl text-[#ff0071]"><Info size={24} /></div>
          <div>
            <h4 className="text-lg font-bold serif">Sincronización de Taller</h4>
            <p className="text-xs text-white/60">Los artesanos pueden actualizar el progreso desde dispositivos móviles en tiempo real.</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-[#ff0071] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
          Ver Cronograma Completo
        </button>
      </div>
    </div>
  );
};

export default Production;
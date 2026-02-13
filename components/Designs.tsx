import React from 'react';
import { AppState } from '../types';
import { Palette, Layers, Grid, Plus, ExternalLink } from 'lucide-react';

interface Props {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const Designs: React.FC<Props> = ({ state }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold serif">Librería de Patrones</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#999] mt-1">Archivo histórico y colecciones 2025</p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 bg-white border border-[#D1D5D8] rounded-xl text-[#999] hover:text-[#ff0071] transition-all">
            <Grid size={18} />
          </button>
          <button className="p-3 bg-white border border-[#D1D5D8] rounded-xl text-[#999] hover:text-black transition-all">
            <Layers size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {state.designs.map((design) => (
          <div key={design.id} className="vintage-card rounded-[2.5rem] overflow-hidden group border-[#D1D5D8] bg-white">
            <div className="h-72 overflow-hidden relative bg-[#F5F5F5]">
              <img src={design.imageUrl} alt={design.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
              <div className="absolute top-6 left-6 flex gap-2">
                {design.colors.map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{backgroundColor: c}} title={c}></div>
                ))}
              </div>
              <button className="absolute bottom-6 right-6 p-3 bg-white/90 backdrop-blur rounded-2xl text-black opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                <ExternalLink size={18} />
              </button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-xl serif text-[#1A1A1A]">{design.name}</h4>
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase border border-[#D1D5D8] text-[#999] rounded-md mt-1 inline-block">
                    {design.category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[#999] uppercase tracking-widest">Base USD</p>
                  <p className="text-lg font-bold text-[#ff0071]">${design.basePriceUSD}</p>
                </div>
              </div>
              <p className="text-xs text-[#666] leading-relaxed mb-8 italic">"{design.description}"</p>
              <div className="flex gap-3">
                <button className="flex-1 py-3.5 text-[10px] font-bold uppercase bg-black text-white rounded-2xl hover:bg-[#ff0071] transition-all shadow-sm">
                  Ver Ficha
                </button>
                <button className="flex-1 py-3.5 text-[10px] font-bold uppercase border border-[#D1D5D8] text-[#666] rounded-2xl hover:bg-[#F5F5F5] transition-all">
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <button className="border-2 border-dashed border-[#D1D5D8] rounded-[2.5rem] h-full min-h-[450px] flex flex-col items-center justify-center p-12 text-[#999] hover:bg-white hover:border-[#ff0071] hover:text-[#ff0071] transition-all group">
          <div className="p-6 bg-[#F5F5F5] rounded-[2rem] group-hover:bg-[#ff0071] group-hover:text-white transition-all mb-6">
            <Palette size={42} />
          </div>
          <h4 className="text-2xl font-bold serif text-[#1A1A1A]">Nuevo Concepto</h4>
          <p className="text-xs text-center mt-3 max-w-[200px] leading-relaxed">Define paleta cromática, bocetos técnicos y costos de exportación.</p>
          <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <Plus size={14} />
            <span>Crear diseño</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Designs;
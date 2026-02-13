import React from 'react';
import { AppState } from '../types';
import { Ruler, Maximize, DollarSign, Plus, ArrowRight } from 'lucide-react';

interface Props {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const Catalog: React.FC<Props> = ({ state }) => {
  const standardSizes = [
    { label: 'Petit', dims: '0.60m x 0.90m', baseCost: 120 },
    { label: 'Medium', dims: '1.20m x 1.80m', baseCost: 350 },
    { label: 'Large', dims: '1.50m x 2.40m', baseCost: 580 },
    { label: 'Extra Large', dims: '2.40m x 3.00m', baseCost: 950 },
    { label: 'Runner', dims: '0.75m x 3.00m', baseCost: 420 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="vintage-card p-10 rounded-[3rem] bg-white border-[#D1D5D8]">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-[#F9FAFB] border border-[#D1D5D8] rounded-2xl text-[#ff0071]">
              <Ruler size={24} />
            </div>
            <h3 className="text-2xl font-bold serif">Formatos Estándar</h3>
          </div>
          
          <div className="space-y-4">
            {standardSizes.map((size, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-[#F9FAFB] rounded-[1.5rem] border border-transparent hover:border-[#D1D5D8] transition-all group">
                <div>
                  <h4 className="font-bold text-[#1A1A1A] serif text-lg">{size.label}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#999] uppercase tracking-widest mt-1">
                    <Maximize size={12} />
                    <span>{size.dims}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-[#999] uppercase tracking-widest">Base Export</p>
                  <p className="text-xl font-bold text-black">USD ${size.baseCost}</p>
                  <p className="text-[10px] text-[#ff0071] font-bold">≈ MXN ${(size.baseCost * state.usdExchangeRate).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="vintage-card p-10 rounded-[3rem] bg-black text-white border-none relative overflow-hidden accent-glow">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-white/10 rounded-2xl text-[#ff0071]">
                <DollarSign size={24} />
                </div>
                <h3 className="text-2xl font-bold serif">Cotizador Inteligente</h3>
            </div>
            
            <div className="space-y-6 bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Ancho (m)</label>
                    <input type="number" defaultValue={1.2} className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-2xl outline-none text-white focus:border-[#ff0071] transition-all" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Largo (m)</label>
                    <input type="number" defaultValue={1.8} className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-2xl outline-none text-white focus:border-[#ff0071] transition-all" />
                </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-white/40">Área Proyectada</span>
                    <span>2.16 m²</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-white/40">Insumo Lana (est)</span>
                    <span>4.3 kg</span>
                </div>
                <div className="flex justify-between items-center pt-8 border-t border-white/10">
                    <span className="text-xl font-bold serif">Presupuesto Final</span>
                    <div className="text-right">
                    <p className="text-3xl font-bold text-[#ff0071]">$397.44 <span className="text-xs text-white/50">USD</span></p>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">MXN ${(397.44 * state.usdExchangeRate).toLocaleString()}</p>
                    </div>
                </div>
                </div>
            </div>
            
            <button className="mt-8 w-full py-5 bg-[#ff0071] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
                Generar Ficha de Venta <ArrowRight size={16} />
            </button>
          </div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#ff0071]/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="vintage-card rounded-[3rem] overflow-hidden bg-white border-[#D1D5D8]">
        <div className="p-10 border-b border-[#F5F5F5] flex justify-between items-center">
          <h3 className="text-xl font-bold serif">Curaduría de Diseños</h3>
          <button className="text-[10px] font-bold uppercase text-[#ff0071] tracking-widest border border-[#ff0071] px-4 py-2 rounded-xl">Explorar Todo</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 p-10 gap-8">
          {state.designs.map((design) => (
            <div key={design.id} className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 border border-[#D1D5D8] group-hover:border-[#ff0071] transition-all">
                <img src={design.imageUrl} alt={design.name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              </div>
              <h4 className="text-sm font-bold truncate group-hover:text-[#ff0071] transition-colors">{design.name}</h4>
              <p className="text-[9px] font-bold text-[#999] uppercase tracking-widest">{design.category}</p>
            </div>
          ))}
          <button className="aspect-[3/4] border-2 border-dashed border-[#D1D5D8] rounded-2xl flex flex-col items-center justify-center gap-3 text-[#999] hover:bg-[#F9FAFB] hover:border-[#ff0071] hover:text-[#ff0071] transition-all group">
            <div className="p-4 bg-[#F5F5F5] rounded-xl group-hover:bg-[#ff0071] group-hover:text-white transition-all"><Plus size={24} /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Nuevo Modelo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
import React, { useState, useMemo } from 'react';
import { AppState } from '../types';
import { Table, Filter, Search, Download, Calculator, Info, ExternalLink } from 'lucide-react';

interface Props {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const SheetsModule: React.FC<Props> = ({ state }) => {
  const [activeTable, setActiveTable] = useState<'inventory' | 'production' | 'orders'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');

  const tableData = useMemo(() => {
    switch (activeTable) {
      case 'inventory': return state.inventory;
      case 'production': return state.production.map(p => ({
        ...p,
        designName: state.designs.find(d => d.id === p.designId)?.name || 'Unknown'
      }));
      case 'orders': return state.orders;
      default: return [];
    }
  }, [activeTable, state]);

  const filteredData = useMemo(() => {
    return tableData.filter(item => 
      JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tableData, searchTerm]);

  const totalValuation = useMemo(() => {
    if (activeTable === 'inventory') {
      return state.inventory.reduce((acc, i) => acc + (i.currency === 'MXN' ? i.costPerUnit * i.quantity : i.costPerUnit * i.quantity * state.usdExchangeRate), 0);
    }
    return 0;
  }, [activeTable, state]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="vintage-card p-6 rounded-[2.5rem] bg-white border-[#D1D5D8] flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="bg-[#F5F5F5] p-1.5 rounded-2xl flex gap-1 border border-[#D1D5D8] w-full lg:w-auto">
          {['inventory', 'production', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTable(tab as any)}
              className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTable === tab ? 'bg-black text-white shadow-lg' : 'text-[#999] hover:text-black'}`}
            >
              {tab === 'inventory' ? 'Inventario' : tab === 'production' ? 'Producción' : 'Pedidos'}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D1D5D8]" size={16} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtro maestro..." 
              className="w-full pl-11 pr-4 py-3 bg-[#F9FAFB] border border-[#D1D5D8] rounded-xl text-sm outline-none focus:border-[#ff0071] transition-all"
            />
          </div>
          <button className="p-3 bg-white border border-[#D1D5D8] rounded-xl text-[#999] hover:text-[#ff0071] transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <div className="vintage-card rounded-[2.5rem] overflow-hidden border-[#D1D5D8] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F9FAFB] text-[10px] font-bold uppercase tracking-[0.2em] text-[#999] border-b border-[#F5F5F5]">
                    {activeTable === 'inventory' && (
                      <>
                        <th className="px-8 py-6">Material</th>
                        <th className="px-8 py-6">Stock</th>
                        <th className="px-8 py-6">Unit Cost</th>
                        <th className="px-8 py-6">Valuation (MXN)</th>
                      </>
                    )}
                    {activeTable === 'production' && (
                      <>
                        <th className="px-8 py-6">Concepto</th>
                        <th className="px-8 py-6">Artesano</th>
                        <th className="px-8 py-6">Avance</th>
                        <th className="px-8 py-6">Status</th>
                      </>
                    )}
                    {activeTable === 'orders' && (
                      <>
                        <th className="px-8 py-6">Cliente</th>
                        <th className="px-8 py-6">Fecha</th>
                        <th className="px-8 py-6">Total</th>
                        <th className="px-8 py-6">Status</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F5]">
                  {filteredData.map((row: any, i) => (
                    <tr key={i} className="hover:bg-[#F9FAFB] transition-colors">
                      {activeTable === 'inventory' && (
                        <>
                          <td className="px-8 py-6 font-bold text-sm text-[#1A1A1A]">{row.name}</td>
                          <td className="px-8 py-6 text-sm">{row.quantity} {row.unit}</td>
                          <td className="px-8 py-6 text-xs text-[#999]">{row.currency} ${row.costPerUnit}</td>
                          <td className="px-8 py-6 font-bold text-[#ff0071] text-sm">
                            ${(row.currency === 'MXN' ? row.costPerUnit * row.quantity : row.costPerUnit * row.quantity * state.usdExchangeRate).toLocaleString()}
                          </td>
                        </>
                      )}
                      {activeTable === 'production' && (
                        <>
                          <td className="px-8 py-6 font-bold text-sm">{row.designName}</td>
                          <td className="px-8 py-6 text-xs font-bold uppercase text-[#666]">{row.assignedTo}</td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-[#ff0071]">{row.progress}%</span>
                                <div className="flex-1 min-w-[60px] bg-[#F5F5F5] h-1 rounded-full overflow-hidden">
                                    <div className="bg-[#ff0071] h-full" style={{width: `${row.progress}%`}}></div>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6"><span className="px-3 py-1 bg-white border border-[#D1D5D8] rounded-full text-[9px] font-bold uppercase">{row.status}</span></td>
                        </>
                      )}
                      {activeTable === 'orders' && (
                        <>
                          <td className="px-8 py-6 font-bold text-sm">{row.customerName}</td>
                          <td className="px-8 py-6 text-xs text-[#999]">{row.orderDate}</td>
                          <td className="px-8 py-6 font-bold">${row.total.toLocaleString()}</td>
                          <td className="px-8 py-6"><span className="px-3 py-1 bg-white border border-[#D1D5D8] rounded-full text-[9px] font-bold uppercase">{row.status}</span></td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-[#F9FAFB] border-t border-[#F5F5F5] flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#999]">Vista de Auditoría: {filteredData.length} registros</span>
              <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:text-[#ff0071] transition-all">
                <Download size={14} /> Exportar Reporte
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="vintage-card p-8 rounded-[2.5rem] bg-black text-white border-none accent-glow">
            <div className="flex items-center gap-3 mb-8 opacity-50">
              <Calculator size={18} />
              <h4 className="text-[10px] font-bold uppercase tracking-widest">Global Insights</h4>
            </div>
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Métrica Activa</p>
                <h3 className="text-2xl font-bold serif">${totalValuation.toLocaleString()} <span className="text-xs opacity-40">MXN</span></h3>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 mb-3 text-[#ff0071]">
                  <Info size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Info Sistema</span>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed italic">
                  Datos calculados dinámicamente según la tasa de cambio USD/MXN configurada en tiempo real.
                </p>
              </div>
            </div>
          </div>

          <button className="w-full vintage-card p-6 rounded-[2rem] border-emerald-100 bg-emerald-50/30 flex items-center justify-between group hover:bg-emerald-50 transition-all">
            <div className="text-left">
              <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Integración Externa</p>
              <h4 className="font-bold text-sm text-emerald-900 serif">Open Google Sheets</h4>
            </div>
            <ExternalLink size={18} className="text-emerald-400 group-hover:text-emerald-600 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SheetsModule;

import React, { useState } from 'react';
import { AppState, InventoryItem } from '../types';
import { Plus, Search, Filter, MoreVertical, AlertCircle } from 'lucide-react';

interface Props {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const Inventory: React.FC<Props> = ({ state, updateState }) => {
  const [filter, setFilter] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const filtered = state.inventory.filter(i => 
    i.name.toLowerCase().includes(filter.toLowerCase()) || 
    i.category.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      category: formData.get('category') as any,
      quantity: Number(formData.get('quantity')),
      unit: formData.get('unit') as string,
      costPerUnit: Number(formData.get('cost')),
      currency: formData.get('currency') as any,
    };
    updateState(prev => ({ ...prev, inventory: [...prev.inventory, newItem] }));
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={16} />
          <input 
            type="text" 
            placeholder="Filtrar materiales..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#D1D5D8] rounded-xl text-sm outline-none focus:border-[#ff0071] transition-all"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-[#ff0071] transition-all accent-glow"
        >
          <Plus size={16} />
          Nuevo Insumo
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <div className="vintage-card rounded-[2rem] overflow-hidden border-[#D1D5D8] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] font-bold text-[#999] uppercase tracking-[0.2em] border-b border-[#F5F5F5] bg-[#F9FAFB]">
                    <th className="px-8 py-5">Item</th>
                    <th className="px-8 py-5">Categoría</th>
                    <th className="px-8 py-5">Stock</th>
                    <th className="px-8 py-5">Costo Unit</th>
                    <th className="px-8 py-5">Valor Total</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F5]">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F9FAFB] transition-colors group">
                      <td className="px-8 py-5 font-bold text-sm">{item.name}</td>
                      <td className="px-8 py-5">
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-md border border-[#D1D5D8] text-[#666]">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${item.quantity < 10 ? 'text-[#ff0071]' : 'text-black'}`}>
                            {item.quantity} {item.unit}
                          </span>
                          {item.quantity < 10 && <AlertCircle size={14} className="text-[#ff0071]" />}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs text-[#999]">
                        {item.currency} ${item.costPerUnit}
                      </td>
                      <td className="px-8 py-5 text-sm font-bold">
                        ${(item.costPerUnit * item.quantity).toLocaleString()}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-[#D1D5D8] transition-all text-[#D1D5D8] hover:text-black">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="vintage-card p-8 rounded-[2rem] bg-black text-white border-none accent-glow">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Valor Total</h4>
            <h3 className="text-3xl font-bold serif">
              ${state.inventory.reduce((acc, i) => acc + (i.currency === 'MXN' ? i.costPerUnit * i.quantity : i.costPerUnit * i.quantity * state.usdExchangeRate), 0).toLocaleString()}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff0071] mt-4">Calculado en MXN</p>
          </div>

          <div className="vintage-card p-7 rounded-[2.5rem] bg-white border-[#D1D5D8]">
            <h4 className="font-bold serif text-lg mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff0071]"></span>
                Alertas
            </h4>
            <div className="space-y-5">
              {state.inventory.filter(i => i.quantity < 10).map(i => (
                <div key={i.id} className="flex items-center justify-between border-b border-[#F5F5F5] pb-3 last:border-0 last:pb-0">
                  <div className="text-sm">
                    <p className="font-bold">{i.name}</p>
                    <p className="text-[10px] text-[#ff0071] font-bold uppercase">{i.quantity} {i.unit} Stock</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full border border-[#D1D5D8] shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-bold serif mb-6">Nuevo Material</h3>
            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-[#999] uppercase tracking-widest mb-2">Nombre</label>
                <input required name="name" className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#D1D5D8] rounded-xl outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#999] uppercase tracking-widest mb-2">Cantidad</label>
                  <input required name="quantity" type="number" className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#D1D5D8] rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#999] uppercase tracking-widest mb-2">Unidad</label>
                  <input required name="unit" placeholder="kg, m, etc" className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#D1D5D8] rounded-xl outline-none" />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 text-xs font-bold text-[#999]">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-xl text-xs font-bold hover:bg-[#ff0071] transition-all">Añadir Insumo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

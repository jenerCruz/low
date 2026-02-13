import React from 'react';
import { AppState } from '../types';
import { ShoppingBag, Truck, CheckCircle, Package, MoreVertical, Search, Filter } from 'lucide-react';

interface Props {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const Orders: React.FC<Props> = ({ state }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por cliente o folio..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#D1D5D8] rounded-xl text-sm outline-none focus:border-[#ff0071] transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none p-3 border border-[#D1D5D8] rounded-xl text-[#666] hover:bg-white transition-all"><Filter size={18} /></button>
          <button className="flex-1 sm:flex-none bg-black text-white px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#ff0071] transition-all group shadow-sm accent-glow">
            <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
            Nuevo Pedido
          </button>
        </div>
      </div>

      {state.orders.length === 0 ? (
        <div className="vintage-card rounded-[3rem] p-24 text-center flex flex-col items-center justify-center bg-white border-[#D1D5D8]">
          <div className="p-8 bg-[#F5F5F5] rounded-[2rem] text-[#D1D5D8] mb-8">
            <Package size={64} />
          </div>
          <h4 className="text-3xl font-bold serif mb-3">Sin pedidos pendientes</h4>
          <p className="text-sm text-[#999] max-w-sm mb-8 leading-relaxed">Los nuevos registros de clientes aparecerán aquí automáticamente.</p>
          <button className="px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#ff0071] transition-all">Registrar Ahora</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="vintage-card rounded-[2.5rem] overflow-hidden border-[#D1D5D8] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] font-bold text-[#999] uppercase tracking-[0.2em] border-b border-[#F5F5F5] bg-[#F9FAFB]">
                    <th className="px-8 py-6">Cliente</th>
                    <th className="px-8 py-6">Referencia</th>
                    <th className="px-8 py-6">Estado</th>
                    <th className="px-8 py-6">Fecha Límite</th>
                    <th className="px-8 py-6">Monto Total</th>
                    <th className="px-8 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F5]">
                  {state.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#F9FAFB] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-[#F5F5F5] border border-[#D1D5D8] flex items-center justify-center font-bold text-[#ff0071] serif text-lg">{order.customerName.charAt(0)}</div>
                           <div>
                              <p className="font-bold text-sm text-[#1A1A1A]">{order.customerName}</p>
                              <p className="text-[10px] text-[#999]">{order.contact}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <p className="text-xs font-bold text-[#666]">ORD-{order.id.slice(-4).toUpperCase()}</p>
                         <p className="text-[10px] text-[#999]">{order.orderDate}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 text-[9px] font-bold uppercase rounded-full border border-[#D1D5D8] bg-white text-[#666]">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-[#ff0071]">
                        {order.deadline}
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-[#1A1A1A]">{order.items[0].currency} ${order.total.toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-[#D1D5D8] text-[#D1D5D8] hover:text-black transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="vintage-card p-10 rounded-[3rem] bg-white border-[#D1D5D8]">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F5F5F5] rounded-2xl text-[#ff0071]"><Truck size={24} /></div>
            <h3 className="text-2xl font-bold serif">Logística y Envíos</h3>
          </div>
          <span className="text-[9px] font-bold text-[#999] uppercase tracking-[0.2em] bg-[#F5F5F5] px-4 py-2 rounded-full">Actualización en vivo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { id: '#9042', customer: 'M. García', destination: 'Puebla, MX', date: '12 Mayo', status: 'En Camino', progress: 65 },
            { id: '#9041', customer: 'Gallery NYC', destination: 'New York, USA', date: '08 Mayo', status: 'Entregado', progress: 100 },
          ].map((shipment, i) => (
            <div key={i} className="flex gap-6 items-start relative">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${shipment.status === 'Entregado' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-[#F9FAFB] border-[#D1D5D8] text-[#ff0071]'}`}>
                  {shipment.status === 'Entregado' ? <CheckCircle size={22} /> : <Truck size={22} />}
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-base serif">{shipment.customer} <span className="text-[#999] text-sm">{shipment.id}</span></h4>
                    <p className="text-[10px] font-bold text-[#999] uppercase tracking-widest">{shipment.destination}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase ${shipment.status === 'Entregado' ? 'text-emerald-600 bg-emerald-50' : 'text-[#ff0071] bg-rose-50'}`}>
                    {shipment.status}
                  </span>
                </div>
                <div className="w-full bg-[#F5F5F5] h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${shipment.status === 'Entregado' ? 'bg-emerald-400' : 'bg-[#ff0071]'}`} style={{width: `${shipment.progress}%`}}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
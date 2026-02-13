import React, { useState } from 'react';
import { Mail, Globe, Search, ArrowLeft, ArrowRight, RotateCw, ShieldCheck, Star, ExternalLink, MessageSquare } from 'lucide-react';

interface Props {
  type: 'mail' | 'browser';
}

const WebResources: React.FC<Props> = ({ type }) => {
  const [url, setUrl] = useState(type === 'mail' ? 'https://mail.google.com' : 'https://www.google.com/search?q=rug+design+trends+2025');
  const [addressInput, setAddressInput] = useState(url);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    setUrl(addressInput.startsWith('http') ? addressInput : `https://www.google.com/search?q=${addressInput}`);
  };

  const services = [
    { name: 'Gmail', icon: 'G', color: 'bg-rose-500', url: 'https://mail.google.com' },
    { name: 'Outlook', icon: 'O', color: 'bg-blue-600', url: 'https://outlook.live.com' },
    { name: 'Proton', icon: 'P', color: 'bg-[#ff0071]', url: 'https://mail.proton.me' },
  ];

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      <div className="vintage-card p-4 rounded-[2rem] flex items-center gap-4 bg-white border-[#D1D5D8]">
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-[#F5F5F5] rounded-xl text-[#999] transition-colors"><ArrowLeft size={18} /></button>
          <button className="p-2.5 hover:bg-[#F5F5F5] rounded-xl text-[#999] transition-colors"><RotateCw size={18} /></button>
        </div>

        <form onSubmit={handleNavigate} className="flex-1 relative">
          <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
          <input 
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            className="w-full pl-11 pr-11 py-3 bg-[#F9FAFB] border border-[#D1D5D8] rounded-2xl text-xs font-bold outline-none focus:border-[#ff0071] transition-all"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D1D5D8] hover:text-black">
            <Search size={16} />
          </button>
        </form>

        <button className="p-2.5 text-amber-400"><Star size={20} fill="currentColor" /></button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="vintage-card p-8 rounded-[2.5rem] bg-white border-[#D1D5D8]">
            <h3 className="font-bold serif text-xl mb-8">{type === 'mail' ? 'Canales de Comunicación' : 'Inspiración Web'}</h3>
            <div className="space-y-3">
              {(type === 'mail' ? services : [
                { name: 'Pinterest', url: 'https://pinterest.com' },
                { name: 'Behance', url: 'https://behance.net' },
                { name: 'Dribbble', url: 'https://dribbble.com' }
              ]).map((s: any) => (
                <button 
                  key={s.name}
                  onClick={() => { setUrl(s.url); setAddressInput(s.url); }}
                  className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] hover:bg-white border border-[#D1D5D8] rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${s.color || 'bg-black'} text-white rounded-lg flex items-center justify-center font-bold text-xs`}>{s.icon || s.name[0]}</div>
                    <span className="text-xs font-bold text-[#1A1A1A]">{s.name}</span>
                  </div>
                  <ExternalLink size={14} className="text-[#D1D5D8] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
            
            <div className="mt-8 p-5 bg-black text-white rounded-[1.5rem] relative overflow-hidden accent-glow">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <MessageSquare size={16} className="text-[#ff0071]" />
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Seguridad</span>
                    </div>
                    <p className="text-[10px] leading-relaxed opacity-70 mb-4 italic">Sitios externos pueden requerir autenticación nativa por políticas X-Frame.</p>
                    <a href={url} target="_blank" className="text-[9px] font-bold uppercase tracking-widest bg-white/10 px-4 py-2 rounded-lg hover:bg-[#ff0071] transition-all flex items-center justify-center gap-2">Explorar Externamente <ExternalLink size={12} /></a>
                </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="vintage-card rounded-[3rem] overflow-hidden bg-white h-full min-h-[550px] border-2 border-[#D1D5D8] shadow-inner flex flex-col items-center justify-center p-16 text-center group">
            <div className="p-10 bg-[#F9FAFB] border border-[#D1D5D8] rounded-full mb-8 group-hover:scale-110 group-hover:border-[#ff0071] transition-all duration-700">
              {type === 'mail' ? <Mail size={64} className="text-[#ff0071]" /> : <Globe size={64} className="text-[#ff0071]" />}
            </div>
            <h3 className="text-3xl font-bold serif mb-6">Portal de Recursos</h3>
            <p className="text-xs text-[#999] max-w-sm mb-10 leading-relaxed font-bold uppercase tracking-[0.2em]">
              Dirección Activa: <br/>
              <span className="text-black break-all mt-2 block">{url}</span>
            </p>
            <div className="flex gap-4">
              <a href={url} target="_blank" className="px-10 py-4 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#ff0071] transition-all shadow-xl flex items-center gap-3">
                Lanzar Portal <ExternalLink size={16} />
              </a>
              <button className="px-10 py-4 border border-[#D1D5D8] text-[#1A1A1A] rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#F9FAFB] transition-all">Configuración</button>
            </div>
            <div className="mt-12 flex items-center gap-3 text-[10px] font-bold uppercase text-emerald-500 tracking-[0.3em] font-bold">
               <div className="w-2 h-2 rounded-full bg-emerald-400 accent-glow"></div>
               Entorno Seguro Activo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebResources;
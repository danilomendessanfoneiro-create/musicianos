
import React, { useState } from 'react';
import { Gig } from '../types';
import { Plus, Calendar, MapPin, Clock } from 'lucide-react';

interface GigsProps {
  gigs: Gig[];
  onAddGig: (gig: Gig) => void;
}

const Gigs: React.FC<GigsProps> = ({ gigs, onAddGig }) => {
  const [showForm, setShowForm] = useState(false);
  const [newGig, setNewGig] = useState<Partial<Gig>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGig.venue && newGig.date) {
      onAddGig({
        id: Date.now().toString(),
        date: newGig.date,
        city: newGig.city || '',
        venue: newGig.venue,
        eventType: newGig.eventType || 'Geral',
        fee: Number(newGig.fee) || 0,
        cost: Number(newGig.cost) || 0,
        notes: newGig.notes || '',
      });
      setShowForm(false);
      setNewGig({});
    }
  };

  const getDaysUntilGig = (dateStr: string) => {
      const today = new Date();
      today.setHours(0,0,0,0);
      const gigDate = new Date(dateStr);
      gigDate.setHours(0,0,0,0);
      const diffTime = gigDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Controle de Shows</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Adicionar Show
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-xl font-bold text-white mb-4">Novo Show</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-zinc-400 mb-1">Data</label>
                    <input type="date" required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white"
                        value={newGig.date || ''} onChange={e => setNewGig({...newGig, date: e.target.value})} />
                </div>
                 <div>
                    <label className="block text-sm text-zinc-400 mb-1">Cidade</label>
                    <input type="text" required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white"
                        value={newGig.city || ''} onChange={e => setNewGig({...newGig, city: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Local / Evento</label>
                  <input type="text" required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white"
                      value={newGig.venue || ''} onChange={e => setNewGig({...newGig, venue: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Tipo de Evento</label>
                  <input type="text" placeholder="Ex: Casamento, Bar..." className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white"
                      value={newGig.eventType || ''} onChange={e => setNewGig({...newGig, eventType: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-zinc-400 mb-1">Cachê (R$)</label>
                    <input type="number" required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white"
                        value={newGig.fee || ''} onChange={e => setNewGig({...newGig, fee: Number(e.target.value)})} />
                </div>
                 <div>
                    <label className="block text-sm text-zinc-400 mb-1">Custos (R$)</label>
                    <input type="number" required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white"
                        value={newGig.cost || ''} onChange={e => setNewGig({...newGig, cost: Number(e.target.value)})} />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-zinc-400 hover:text-white">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Salvar</button>
              </div>
            </form>
            </div>
        </div>
      )}

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-900/50 border-b border-zinc-800 text-zinc-200 uppercase tracking-wider">
                <tr>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Data</th>
                    <th className="p-4 font-medium">Local / Tipo</th>
                    <th className="p-4 font-medium">Cidade</th>
                    <th className="p-4 font-medium text-right">Cachê</th>
                    <th className="p-4 font-medium text-right">Custos</th>
                    <th className="p-4 font-medium text-right">Lucro Líquido</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
                {gigs.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(gig => {
                    const daysUntil = getDaysUntilGig(gig.date);
                    const isUpcoming = daysUntil >= 0 && daysUntil <= 7;
                    
                    return (
                    <tr key={gig.id} className={`transition-colors ${isUpcoming ? 'bg-indigo-900/10 hover:bg-indigo-900/20' : 'hover:bg-zinc-800/50'}`}>
                        <td className="p-4">
                            {isUpcoming ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse">
                                    <Clock size={12} /> Em {daysUntil === 0 ? 'Hoje' : `${daysUntil} dias`}
                                </span>
                            ) : daysUntil < 0 ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-500">
                                    Concluído
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-900/20 text-emerald-400">
                                    Agendado
                                </span>
                            )}
                        </td>
                        <td className="p-4 flex items-center gap-2 text-white">
                             <Calendar size={14} className="text-zinc-500" />
                             {new Date(gig.date).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-white">{gig.venue}</div>
                          <div className="text-xs text-zinc-500">{gig.eventType}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-zinc-500" />
                              {gig.city}
                          </div>
                        </td>
                        <td className="p-4 text-right text-emerald-400 font-medium">+ R$ {gig.fee}</td>
                        <td className="p-4 text-right text-red-400">- R$ {gig.cost}</td>
                        <td className="p-4 text-right text-white font-bold">R$ {gig.fee - gig.cost}</td>
                    </tr>
                )})}
            </tbody>
        </table>
        {gigs.length === 0 && (
            <div className="p-12 text-center text-zinc-500">
                Nenhum show cadastrado. Adicione seu primeiro show!
            </div>
        )}
      </div>
    </div>
  );
};

export default Gigs;

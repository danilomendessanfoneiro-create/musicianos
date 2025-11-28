
import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';
import { Plus, MoreHorizontal, Phone, Mail, Users, Search, AlertCircle, Filter, Clock, MessageCircle, Calendar, Pencil } from 'lucide-react';

interface CRMProps {
  leads: Lead[];
  onAddLead: (lead: Lead) => void;
  onUpdateLead: (lead: Lead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
}

const CRM: React.FC<CRMProps> = ({ leads, onAddLead, onUpdateLead, onUpdateStatus }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLead, setNewLead] = useState<Partial<Lead>>({ status: LeadStatus.NEW });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLead.name && newLead.venue) {
      if (editingId) {
        // Update existing lead
        onUpdateLead({
          id: editingId,
          name: newLead.name,
          venue: newLead.venue,
          channel: newLead.channel || 'Desconhecido',
          value: Number(newLead.value) || 0,
          status: newLead.status || LeadStatus.NEW,
          lastContact: newLead.lastContact || new Date().toISOString(),
        });
      } else {
        // Create new lead
        onAddLead({
          id: Date.now().toString(),
          name: newLead.name,
          venue: newLead.venue,
          channel: newLead.channel || 'Desconhecido',
          value: Number(newLead.value) || 0,
          status: newLead.status || LeadStatus.NEW,
          lastContact: new Date().toISOString(),
        });
      }
      
      closeForm();
    }
  };

  const handleEdit = (lead: Lead) => {
    setNewLead(lead);
    setEditingId(lead.id);
    setShowForm(true);
  };

  const openNewForm = () => {
    setNewLead({ status: LeadStatus.NEW });
    setEditingId(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setNewLead({ status: LeadStatus.NEW });
  };

  const getDaysSinceContact = (dateString: string) => {
    const last = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diff = now - last;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  // Filter logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.venue.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = Object.values(LeadStatus);

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h2 className="text-3xl font-bold text-white">CRM <span className="text-zinc-500 text-lg font-normal ml-2">Gestão de Contatos</span></h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar leads..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 w-full md:w-64"
                />
            </div>

            {/* Status Filter */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none">
                    <Filter size={16} />
                </div>
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer hover:bg-zinc-800 transition-colors"
                >
                    <option value="All">Todos os Status</option>
                    {Object.values(LeadStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            <button 
            onClick={openNewForm}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
            <Plus size={18} /> Novo Lead
            </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">{editingId ? 'Editar Contato' : 'Adicionar Contato'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Nome do Contratante</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newLead.name || ''}
                  onChange={e => setNewLead({...newLead, name: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Local / Evento</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newLead.venue || ''}
                  onChange={e => setNewLead({...newLead, venue: e.target.value})}
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Canal de Contato</label>
                  <input 
                    type="text" 
                    placeholder="Ex: WhatsApp"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newLead.channel || ''}
                    onChange={e => setNewLead({...newLead, channel: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Valor Proposto (R$)</label>
                  <input 
                    type="number" 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newLead.value || ''}
                    onChange={e => setNewLead({...newLead, value: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Etapa / Status</label>
                <select 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newLead.status}
                    onChange={e => setNewLead({...newLead, status: e.target.value as LeadStatus})}
                >
                    {Object.values(LeadStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={closeForm} className="px-4 py-2 text-zinc-400 hover:text-white">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 min-w-[1000px] h-full pb-4">
          {columns.map(status => {
            const columnLeads = filteredLeads.filter(l => l.status === status);
            const isColumnVisible = statusFilter === 'All' || statusFilter === status;

            if (!isColumnVisible) return null;

            return (
                <div key={status} className="flex-1 min-w-[280px] bg-zinc-900/50 rounded-xl border border-zinc-800 flex flex-col">
                <div className={`p-4 border-b border-zinc-800 font-semibold flex justify-between items-center
                    ${status === LeadStatus.NEW ? 'text-blue-400' : 
                    status === LeadStatus.CONTACTED ? 'text-yellow-400' :
                    status === LeadStatus.NEGOTIATING ? 'text-orange-400' :
                    status === LeadStatus.BOOKED ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                    <span>{status}</span>
                    <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs text-zinc-400">
                    {columnLeads.length}
                    </span>
                </div>
                <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                    {columnLeads.map(lead => {
                         const daysSince = getDaysSinceContact(lead.lastContact);
                         const needsFollowUp = daysSince > 7 && status !== LeadStatus.BOOKED && status !== LeadStatus.LOST;
                         const formattedDate = new Date(lead.lastContact).toLocaleDateString('pt-BR');

                        return (
                        <div key={lead.id} className={`bg-zinc-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-all group relative border-l-4 
                             ${status === LeadStatus.NEW ? 'border-blue-500/20 hover:border-blue-500' : 
                             status === LeadStatus.CONTACTED ? 'border-yellow-500/20 hover:border-yellow-500' :
                             status === LeadStatus.NEGOTIATING ? 'border-orange-500/20 hover:border-orange-500' :
                             status === LeadStatus.BOOKED ? 'border-emerald-500/20 hover:border-emerald-500' : 'border-red-500/20 hover:border-red-500'
                            }`}>
                            
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-white">{lead.venue}</h4>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => handleEdit(lead)}
                                        className="text-zinc-500 hover:text-indigo-400 p-1 rounded hover:bg-zinc-700 transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 mb-2">
                                <p className="text-sm text-zinc-400 flex items-center gap-1">
                                    <Users size={12} /> {lead.name}
                                </p>
                                <p className="text-xs text-zinc-500 flex items-center gap-1">
                                    <MessageCircle size={12} /> {lead.channel}
                                </p>
                            </div>

                            <p className="text-sm font-semibold text-emerald-400 mb-3">R$ {lead.value.toLocaleString('pt-BR')}</p>
                            
                            {needsFollowUp && (
                                <div className="mb-3 flex items-center gap-2 text-xs text-orange-400 bg-orange-900/20 p-2 rounded border border-orange-900/50">
                                    <AlertCircle size={14} />
                                    <span>Sem contato há {daysSince} dias</span>
                                </div>
                            )}

                            <div className="mb-3 flex items-center justify-between gap-2 text-xs text-zinc-500 bg-zinc-900/50 p-2 rounded">
                                <div className="flex items-center gap-2">
                                    <Calendar size={12} />
                                    <span>{formattedDate}</span>
                                </div>
                                <span>{daysSince === 0 ? 'Hoje' : `${daysSince}d atrás`}</span>
                            </div>

                            <div className="flex gap-2 border-t border-zinc-700 pt-3">
                                <button className="flex-1 py-1.5 rounded bg-zinc-700 hover:bg-zinc-600 flex justify-center items-center text-zinc-300 transition-colors">
                                    <Phone size={14} />
                                </button>
                                <button className="flex-1 py-1.5 rounded bg-zinc-700 hover:bg-zinc-600 flex justify-center items-center text-zinc-300 transition-colors">
                                    <Mail size={14} />
                                </button>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2">
                                {status !== LeadStatus.BOOKED && (
                                    <button 
                                        onClick={() => onUpdateStatus(lead.id, LeadStatus.BOOKED)}
                                        className="text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-900 py-1 rounded hover:bg-emerald-900/50 transition-colors"
                                    >
                                        Fechar
                                    </button>
                                )}
                                {status !== LeadStatus.LOST && status !== LeadStatus.BOOKED && (
                                    <button 
                                        onClick={() => onUpdateStatus(lead.id, LeadStatus.LOST)}
                                        className="text-xs bg-red-900/30 text-red-400 border border-red-900 py-1 rounded hover:bg-red-900/50 transition-colors"
                                    >
                                        Perdido
                                    </button>
                                )}
                                {status === LeadStatus.NEW && (
                                    <button 
                                        onClick={() => onUpdateStatus(lead.id, LeadStatus.CONTACTED)}
                                        className="text-xs bg-blue-900/30 text-blue-400 border border-blue-900 py-1 rounded hover:bg-blue-900/50 col-span-2 transition-colors"
                                    >
                                        Marcar 1º Contato
                                    </button>
                                )}
                            </div>
                        </div>
                    )})}
                </div>
                </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default CRM;

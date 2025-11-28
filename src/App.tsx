import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, Briefcase, DollarSign, Users, Target, Lock, Menu, X } from 'lucide-react';

// ====================================================================
// TIPOS DE DADOS
// ====================================================================

// Define o estado de visualização do painel (para navegação)
type ViewState = 'dashboard' | 'crm' | 'gigs' | 'finance' | 'projects' | 'admin';

// Tipos base
enum LeadStatus {
  NEW = 'new',
  NEGOTIATING = 'negotiating',
  BOOKED = 'booked',
  LOST = 'lost',
}

interface Lead {
  id: string;
  name: string;
  venue: string;
  channel: 'WhatsApp' | 'Email' | 'Instagram' | 'Referral';
  value: number;
  status: LeadStatus;
  lastContact: string; // YYYY-MM-DD
}

interface Gig {
  id: string;
  date: string; // YYYY-MM-DD
  city: string;
  venue: string;
  eventType: string;
  fee: number;
  cost: number;
  notes: string;
}

interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

interface Project {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  cost: number;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  description: string;
}

interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

// ====================================================================
// DADOS MOCKADOS E INICIAIS
// ====================================================================

const INITIAL_LEADS: Lead[] = [
  { id: '1', name: 'Marcos Eventos', venue: 'Bar do Zé', channel: 'WhatsApp', value: 1200, status: LeadStatus.NEGOTIATING, lastContact: '2023-10-25' },
  { id: '2', name: 'Wedding Planner Ana', venue: 'Casamento Silva', channel: 'Instagram', value: 4500, status: LeadStatus.NEW, lastContact: '2023-10-26' },
  { id: '3', name: 'Festival de Rock', venue: 'City Hall', channel: 'Email', value: 3000, status: LeadStatus.BOOKED, lastContact: '2023-10-20' },
];

const INITIAL_GIGS: Gig[] = [
  { id: '1', date: '2023-11-15', city: 'São Paulo', venue: 'Blue Note SP', eventType: 'Jazz Club', fee: 2500, cost: 200, notes: 'Jazz Trio' },
  { id: '2', date: '2023-11-20', city: 'Campinas', venue: 'Sesc Campinas', eventType: 'Workshop', fee: 1800, cost: 150, notes: 'Workshop' },
];

const INITIAL_FINANCE: Transaction[] = [
  { id: '1', date: '2023-11-01', description: 'Cachê Blue Note (Adiantamento)', amount: 1000, type: 'income', category: 'Show' },
  { id: '2', date: '2023-11-05', description: 'Cordas de Guitarra', amount: 120, type: 'expense', category: 'Equipamento' },
  { id: '3', date: '2023-11-02', description: 'Gasolina', amount: 150, type: 'expense', category: 'Viagem' },
];

const INITIAL_PROJECTS: Project[] = [
  { id: '1', title: 'Gravar EP', dueDate: '2023-12-10', cost: 5000, status: 'planning', description: 'Gravar 4 músicas autorais no estúdio X' },
  { id: '2', title: 'Fotos Promo', dueDate: '2023-11-25', cost: 800, status: 'in-progress', description: 'Sessão de fotos com fotógrafo Y' },
];

const MOCK_USER: User = { id: 'user-01', name: 'João Músico', role: 'user' };

// ====================================================================
// SERVIÇOS MOCKADOS (Auth)
// ====================================================================

// Hook para simular a autenticação e gerenciar o estado do usuário
const useAuth = () => {
  const [user, setUser] = useState<User | null>(MOCK_USER); // Assume logado por padrão
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula a verificação de autenticação inicial
    const checkAuth = setTimeout(() => {
      setLoading(false);
    }, 50);

    return () => clearTimeout(checkAuth);
  }, []);

  const login = (username: string) => {
    // Lógica de login simulada
    if (username === 'admin') {
      setUser({ id: 'admin-01', name: 'Admin User', role: 'admin' });
    } else {
      setUser(MOCK_USER);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return { user, loading, login, logout };
};

// ====================================================================
// COMPONENTES DE LAYOUT E ROTEAMENTO INTERNO (SIMPLIFICADOS)
// ====================================================================

// Componente de Botão de Navegação
const NavButton: React.FC<{ icon: React.ReactNode, label: string, view: ViewState, currentView: ViewState, onClick: (view: ViewState) => void }> = ({ icon, label, view, currentView, onClick }) => (
  <button
    className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 ${
      currentView === view
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50'
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
    }`}
    onClick={() => onClick(view)}
  >
    {icon}
    <span className="ml-4 text-sm font-medium">{label}</span>
  </button>
);

// Componente Sidebar
const Sidebar: React.FC<{ currentView: ViewState, onChangeView: (view: ViewState) => void, user: User | null, onLogout: () => void }> = ({ currentView, onChangeView, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { view: ViewState, label: string, icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { view: 'gigs', label: 'Shows', icon: <Briefcase className="w-5 h-5" /> },
    { view: 'crm', label: 'CRM / Contatos', icon: <Users className="w-5 h-5" /> },
    { view: 'finance', label: 'Finanças', icon: <DollarSign className="w-5 h-5" /> },
    { view: 'projects', label: 'Projetos', icon: <Target className="w-5 h-5" /> },
  ];

  if (user?.role === 'admin') {
    navItems.push({ view: 'admin', label: 'Admin', icon: <Lock className="w-5 h-5" /> });
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 md:hidden bg-zinc-900 rounded-full text-white shadow-xl"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar (Desktop/Mobile) */}
      <div 
        className={`
          fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:relative md:translate-x-0 transition duration-300 ease-in-out
          w-64 bg-zinc-900 p-6 flex flex-col z-40
        `}
      >
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-indigo-400">Músico<span className="text-white">Pro</span></h1>
          <button className="md:hidden text-zinc-400 hover:text-white" onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-grow space-y-2">
          {navItems.map(item => (
            <NavButton
              key={item.view}
              icon={item.icon}
              label={item.label}
              view={item.view}
              currentView={currentView}
              onClick={(view) => { onChangeView(view as ViewState); setIsOpen(false); }}
            />
          ))}
        </nav>

        <div className="pt-4 border-t border-zinc-700 mt-auto">
          <div className="text-sm text-zinc-400 mb-2">
            Olá, {user?.name || 'Visitante'}
          </div>
          <button
            onClick={onLogout}
            className="flex items-center w-full p-3 rounded-xl text-red-400 hover:bg-zinc-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-4 text-sm font-medium">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Componente de Cartão Simples
const Card: React.FC<{ title: string, value: string | number, color: string }> = ({ title, value, color }) => (
  <div className={`p-6 rounded-2xl shadow-xl border-t-4 ${color} bg-zinc-800`}>
    <h3 className="text-sm font-medium text-zinc-400 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-white">{value}</p>
  </div>
);

// ====================================================================
// TELAS DO PAINEL
// ====================================================================

// Tela: Dashboard
const Dashboard: React.FC<{ gigs: Gig[], leads: Lead[], finance: Transaction[] }> = ({ gigs, leads, finance }) => {
  const totalLeads = leads.length;
  const bookedLeads = leads.filter(l => l.status === LeadStatus.BOOKED).length;
  const negotiatingLeads = leads.filter(l => l.status === LeadStatus.NEGOTIATING).length;
  
  const totalIncome = finance.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = finance.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const upcomingGigs = gigs.filter(g => new Date(g.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3);

  const formatCurrency = (amount: number) => `R$ ${amount.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-yellow-600';
      case LeadStatus.NEGOTIATING: return 'bg-blue-600';
      case LeadStatus.BOOKED: return 'bg-green-600';
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-extrabold text-white mb-6 border-b border-indigo-500 pb-2">Visão Geral</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Shows Próximos" value={gigs.length} color="border-indigo-500" />
        <Card title="Leads Ativos" value={negotiatingLeads} color="border-yellow-500" />
        <Card title="Receita Bruta (Total)" value={formatCurrency(totalIncome)} color="border-green-500" />
        <Card title="Saldo Líquido" value={formatCurrency(netBalance)} color={netBalance >= 0 ? 'border-teal-500' : 'border-red-500'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Próximos Shows */}
        <div className="lg:col-span-2 bg-zinc-900 p-6 rounded-2xl shadow-2xl">
          <h3 className="text-xl font-semibold mb-4 text-indigo-300">Próximos Shows</h3>
          {upcomingGigs.length > 0 ? (
            <ul className="space-y-3">
              {upcomingGigs.map(gig => (
                <li key={gig.id} className="flex justify-between items-center p-4 bg-zinc-800 rounded-xl shadow-md">
                  <div>
                    <p className="text-lg font-medium">{new Date(gig.date).toLocaleDateString('pt-BR')}</p>
                    <p className="text-zinc-400 text-sm">{gig.venue} em {gig.city}</p>
                  </div>
                  <span className="text-teal-400 font-bold">{formatCurrency(gig.fee)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 italic">Nenhum show agendado em breve.</p>
          )}
        </div>
        
        {/* Status dos Leads */}
        <div className="bg-zinc-900 p-6 rounded-2xl shadow-2xl">
          <h3 className="text-xl font-semibold mb-4 text-yellow-300">Funil de Leads ({totalLeads})</h3>
          <ul className="space-y-3">
            {Object.values(LeadStatus).map(status => {
              const count = leads.filter(l => l.status === status).length;
              return (
                <li key={status} className="flex justify-between items-center p-3 bg-zinc-800 rounded-lg">
                  <span className="capitalize">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${getStatusColor(status)}`}>{count}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Tela: CRM
const CRM: React.FC<{ leads: Lead[], onAddLead: (lead: Lead) => void, onUpdateLead: (lead: Lead) => void, onUpdateStatus: (id: string, status: LeadStatus) => void }> = ({ leads, onAddLead, onUpdateLead, onUpdateStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState<Omit<Lead, 'id' | 'status'>>({
    name: '',
    venue: '',
    channel: 'Email',
    value: 0,
    lastContact: new Date().toISOString().substring(0, 10),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLead({
      ...newLead,
      id: Date.now().toString(),
      status: LeadStatus.NEW,
    });
    setIsModalOpen(false);
    setNewLead({
      name: '', venue: '', channel: 'Email', value: 0, lastContact: new Date().toISOString().substring(0, 10),
    });
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'text-yellow-400 border-yellow-400';
      case LeadStatus.NEGOTIATING: return 'text-blue-400 border-blue-400';
      case LeadStatus.BOOKED: return 'text-green-400 border-green-400';
      case LeadStatus.LOST: return 'text-red-400 border-red-400';
      default: return 'text-zinc-400 border-zinc-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-indigo-500 pb-2">
        <h2 className="text-3xl font-extrabold text-white">Gestão de Contatos (CRM)</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
        >
          + Novo Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(LeadStatus).map(status => (
          <div key={status} className="bg-zinc-900 p-4 rounded-xl shadow-lg">
            <h3 className={`text-lg font-bold mb-4 capitalize ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)} ({leads.filter(l => l.status === status).length})
            </h3>
            <div className="space-y-3 h-[60vh] overflow-y-auto pr-2">
              {leads.filter(l => l.status === status).map(lead => (
                <div key={lead.id} className="bg-zinc-800 p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
                  <p className="font-semibold text-white">{lead.name}</p>
                  <p className="text-sm text-zinc-400 italic">{lead.venue}</p>
                  <p className="text-xs text-teal-400 font-mono">R$ {lead.value.toFixed(2)}</p>
                  
                  <div className="mt-2 pt-2 border-t border-zinc-700 flex flex-wrap gap-2">
                    {Object.values(LeadStatus).filter(s => s !== status).map(s => (
                      <button 
                        key={s}
                        onClick={() => onUpdateStatus(lead.id, s)}
                        className={`text-xs px-2 py-1 rounded-full capitalize transition-colors ${getStatusColor(s).replace('border', 'hover:bg').replace('text', 'text-white')}`}
                      >
                        Mover para {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Novo Lead */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-indigo-400">Adicionar Novo Lead</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nome do Cliente/Empresa"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                required
              />
              <input
                type="text"
                placeholder="Local/Evento"
                value={newLead.venue}
                onChange={(e) => setNewLead({ ...newLead, venue: e.target.value })}
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                required
              />
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Valor Estimado (R$)"
                  value={newLead.value || ''}
                  onChange={(e) => setNewLead({ ...newLead, value: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                  min="0"
                  required
                />
                <select
                  value={newLead.channel}
                  onChange={(e) => setNewLead({ ...newLead, channel: e.target.value as Lead['channel'] })}
                  className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                  required
                >
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referral">Indicação</option>
                </select>
              </div>
              <input
                type="date"
                placeholder="Último Contato"
                value={newLead.lastContact}
                onChange={(e) => setNewLead({ ...newLead, lastContact: e.target.value })}
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                required
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-700 rounded-xl text-white hover:bg-zinc-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Salvar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Tela: Shows (Gigs)
const Gigs: React.FC<{ gigs: Gig[], onAddGig: (gig: Gig) => void }> = ({ gigs, onAddGig }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGig, setNewGig] = useState<Omit<Gig, 'id'>>({
    date: new Date().toISOString().substring(0, 10),
    city: '',
    venue: '',
    eventType: '',
    fee: 0,
    cost: 0,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGig({
      ...newGig,
      id: Date.now().toString(),
    });
    setIsModalOpen(false);
    setNewGig({
      date: new Date().toISOString().substring(0, 10), city: '', venue: '', eventType: '', fee: 0, cost: 0, notes: '',
    });
  };

  const sortedGigs = [...gigs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-indigo-500 pb-2">
        <h2 className="text-3xl font-extrabold text-white">Shows Agendados</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
        >
          + Novo Show
        </button>
      </div>

      <div className="overflow-x-auto bg-zinc-900 rounded-2xl p-4 shadow-xl">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead className="bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Local/Cidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Tipo de Evento</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Cachê</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Custo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {sortedGigs.map((gig) => (
              <tr key={gig.id} className="hover:bg-zinc-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{new Date(gig.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{gig.venue} ({gig.city})</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{gig.eventType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-teal-400">R$ {gig.fee.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-400">R$ {gig.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Novo Show */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4 text-indigo-400">Adicionar Novo Show</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="date"
                value={newGig.date}
                onChange={(e) => setNewGig({ ...newGig, date: e.target.value })}
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                required
              />
              <input
                type="text"
                placeholder="Local/Casa de Show"
                value={newGig.venue}
                onChange={(e) => setNewGig({ ...newGig, venue: e.target.value })}
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                required
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Cidade"
                  value={newGig.city}
                  onChange={(e) => setNewGig({ ...newGig, city: e.target.value })}
                  className="w-1/2 p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Tipo de Evento"
                  value={newGig.eventType}
                  onChange={(e) => setNewGig({ ...newGig, eventType: e.target.value })}
                  className="w-1/2 p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                  required
                />
              </div>
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Cachê (R$)"
                  value={newGig.fee || ''}
                  onChange={(e) => setNewGig({ ...newGig, fee: parseFloat(e.target.value) || 0 })}
                  className="w-1/2 p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Custo Estimado (R$)"
                  value={newGig.cost || ''}
                  onChange={(e) => setNewGig({ ...newGig, cost: parseFloat(e.target.value) || 0 })}
                  className="w-1/2 p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                  min="0"
                />
              </div>
              <textarea
                placeholder="Notas (Repertório, requisitos técnicos, etc.)"
                value={newGig.notes}
                onChange={(e) => setNewGig({ ...newGig, notes: e.target.value })}
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white h-24"
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-700 rounded-xl text-white hover:bg-zinc-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Agendar Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Tela: Finanças
const Finance: React.FC<{ transactions: Transaction[], onAddTransaction: (t: Transaction) => void }> = ({ transactions, onAddTransaction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
    date: new Date().toISOString().substring(0, 10),
    description: '',
    amount: 0,
    type: 'income',
    category: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      ...newTransaction,
      id: Date.now().toString(),
    });
    setIsModalOpen(false);
    setNewTransaction({
      date: new Date().toISOString().substring(0, 10), description: '', amount: 0, type: 'income', category: '',
    });
  };

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const formatCurrency = (amount: number) => `R$ ${amount.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-indigo-500 pb-2">
        <h2 className="text-3xl font-extrabold text-white">Gestão Financeira</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
        >
          + Nova Transação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Receita Total" value={formatCurrency(totalIncome)} color="border-green-500" />
        <Card title="Despesa Total" value={formatCurrency(totalExpense)} color="border-red-500" />
        <Card title="Balanço Líquido" value={formatCurrency(netBalance)} color={netBalance >= 0 ? 'border-teal-500' : 'border-red-500'} />
      </div>

      <div className="overflow-x-auto bg-zinc-900 rounded-2xl p-4 shadow-xl">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead className="bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {sortedTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{t.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{t.category}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${t.type === 'income' ? 'text-teal-400' : 'text-red-400'}`}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Nova Transação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-indigo-400">Adicionar Transação</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                required
              />
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as Transaction['type'] })}
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                required
              >
                <option value="income">Receita (Entrada)</option>
                <option value="expense">Despesa (Saída)</option>
              </select>
              <input
                type="text"
                placeholder="Descrição"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                required
              />
              <input
                type="text"
                placeholder="Categoria (ex: Show, Equipamento, Viagem)"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                required
              />
              <input
                type="number"
                placeholder="Valor (R$)"
                value={newTransaction.amount || ''}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                min="0.01"
                step="0.01"
                required
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-700 rounded-xl text-white hover:bg-zinc-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Tela: Projetos
const Projects: React.FC<{ projects: Project[], onAddProject: (p: Project) => void, onUpdateStatus: (id: string, status: Project['status']) => void }> = ({ projects, onAddProject, onUpdateStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'status'>>({
    title: '',
    dueDate: new Date().toISOString().substring(0, 10),
    cost: 0,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProject({
      ...newProject,
      id: Date.now().toString(),
      status: 'planning',
    });
    setIsModalOpen(false);
    setNewProject({
      title: '', dueDate: new Date().toISOString().substring(0, 10), cost: 0, description: '',
    });
  };

  const getStatusStyle = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'bg-yellow-800 text-yellow-300';
      case 'in-progress': return 'bg-blue-800 text-blue-300';
      case 'completed': return 'bg-green-800 text-green-300';
      case 'on-hold': return 'bg-red-800 text-red-300';
      default: return 'bg-zinc-700 text-zinc-300';
    }
  };

  const sortedProjects = [...projects].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-indigo-500 pb-2">
        <h2 className="text-3xl font-extrabold text-white">Gestão de Projetos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
        >
          + Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProjects.map((project) => (
          <div key={project.id} className="bg-zinc-900 p-6 rounded-2xl shadow-xl border-t-4 border-indigo-600 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-white leading-tight">{project.title}</h3>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${getStatusStyle(project.status)}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
              </span>
            </div>
            
            <p className="text-sm text-zinc-400">{project.description}</p>
            
            <div className="text-sm text-zinc-300 pt-2 border-t border-zinc-800">
              <p>Prazo: <span className="font-medium">{new Date(project.dueDate).toLocaleDateString('pt-BR')}</span></p>
              <p>Custo Est.: <span className="font-medium text-red-400">R$ {project.cost.toFixed(2)}</span></p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-wrap gap-2">
              {(['planning', 'in-progress', 'completed', 'on-hold'] as Project['status'][]).filter(s => s !== project.status).map(s => (
                <button
                  key={s}
                  onClick={() => onUpdateStatus(project.id, s)}
                  className={`text-xs px-2 py-1 rounded-full capitalize transition-colors ${getStatusStyle(s)} hover:opacity-80`}

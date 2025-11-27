
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CRM from './components/CRM';
import Gigs from './components/Gigs';
import Finance from './components/Finance';
import Projects from './components/Projects';
import { ViewState, Gig, Lead, Transaction, Project, LeadStatus } from './types';

// Mock Data
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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // App State
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [gigs, setGigs] = useState<Gig[]>(INITIAL_GIGS);
  const [finance, setFinance] = useState<Transaction[]>(INITIAL_FINANCE);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  // Actions
  const addLead = (lead: Lead) => setLeads([...leads, lead]);
  
  const updateLead = (updatedLead: Lead) => {
    setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    // If booked, automatically add to gigs? (Simplification: just manual for now)
  };

  const addGig = (gig: Gig) => {
    setGigs([...gigs, gig]);
    // Auto-add income transaction
    if (gig.fee > 0) {
      addTransaction({
        id: Date.now().toString() + '_inc',
        date: gig.date,
        description: `Cachê: ${gig.venue}`,
        amount: gig.fee,
        type: 'income',
        category: 'Show'
      });
    }
  };

  const addTransaction = (t: Transaction) => setFinance([...finance, t]);

  const addProject = (p: Project) => setProjects([...projects, p]);
  const updateProjectStatus = (id: string, status: Project['status']) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status } : p));
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex font-sans selection:bg-indigo-500/30">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        {currentView === 'dashboard' && (
          <Dashboard gigs={gigs} leads={leads} finance={finance} />
        )}
        {currentView === 'crm' && (
          <CRM 
            leads={leads} 
            onAddLead={addLead} 
            onUpdateLead={updateLead}
            onUpdateStatus={updateLeadStatus} 
          />
        )}
        {currentView === 'gigs' && (
          <Gigs gigs={gigs} onAddGig={addGig} />
        )}
        {currentView === 'finance' && (
          <Finance transactions={finance} onAddTransaction={addTransaction} />
        )}
        {currentView === 'projects' && (
          <Projects projects={projects} onAddProject={addProject} onUpdateStatus={updateProjectStatus} />
        )}
      </main>
    </div>
  );
};

export default App;

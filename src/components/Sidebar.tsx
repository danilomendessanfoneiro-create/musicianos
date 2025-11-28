import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Users, Music, DollarSign, Calendar, Mic2 } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'crm', label: 'CRM / Leads', icon: <Users size={20} /> },
    { id: 'gigs', label: 'Shows', icon: <Music size={20} /> },
    { id: 'finance', label: 'Financeiro', icon: <DollarSign size={20} /> },
    { id: 'projects', label: 'Projetos', icon: <Calendar size={20} /> },
  ];

  return (
    <div className="w-20 md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3 border-b border-zinc-800">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Mic2 className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold text-white hidden md:block">MusicianOS</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800 hidden md:block">
        <div className="bg-zinc-800/50 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase font-bold mb-2">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-zinc-300">Online & Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

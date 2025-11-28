
import React, { useState } from 'react';
import { Project } from '../types';
import { Calendar as CalendarIcon, CheckCircle, Circle, Plus, Clock, DollarSign } from 'lucide-react';

interface ProjectsProps {
  projects: Project[];
  onAddProject: (p: Project) => void;
  onUpdateStatus: (id: string, status: Project['status']) => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects, onAddProject, onUpdateStatus }) => {
    const [showForm, setShowForm] = useState(false);
    const [newProj, setNewProj] = useState<Partial<Project>>({ status: 'planning' });

    // Generate days for simple calendar view (current month)
    const daysInMonth = Array.from({length: 30}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProj.title && newProj.dueDate) {
            onAddProject({
                id: Date.now().toString(),
                title: newProj.title,
                dueDate: newProj.dueDate,
                cost: Number(newProj.cost) || 0,
                description: newProj.description || '',
                status: 'planning'
            });
            setShowForm(false);
            setNewProj({ status: 'planning' });
        }
    };

  return (
    <div className="space-y-6 h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Projetos & Agenda</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Novo Projeto
        </button>
      </div>

       {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Agendar Projeto</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Título</label>
                        <input required type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white"
                            value={newProj.title || ''} onChange={e => setNewProj({...newProj, title: e.target.value})} />
                    </div>
                     <div>
                        <label className="block text-sm text-zinc-400 mb-1">Data de Entrega / Evento</label>
                        <input required type="date" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white"
                            value={newProj.dueDate || ''} onChange={e => setNewProj({...newProj, dueDate: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Custo Previsto (R$)</label>
                        <input type="number" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white"
                            value={newProj.cost || ''} onChange={e => setNewProj({...newProj, cost: Number(e.target.value)})} />
                    </div>
                     <div>
                        <label className="block text-sm text-zinc-400 mb-1">Descrição</label>
                        <textarea className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white h-24"
                            value={newProj.description || ''} onChange={e => setNewProj({...newProj, description: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-zinc-400 hover:text-white">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        {/* Project List */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Clock size={18} className="text-indigo-400"/> Cronograma</h3>
            <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-2">
                {projects.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(proj => (
                    <div key={proj.id} className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-indigo-500/30 transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className={`font-semibold text-lg ${proj.status === 'completed' ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                    {proj.title}
                                </h4>
                                <p className="text-sm text-zinc-400 mt-1">{proj.description}</p>
                                <div className="flex items-center gap-4 mt-3">
                                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                                        <CalendarIcon size={12} />
                                        {new Date(proj.dueDate).toLocaleDateString()}
                                    </span>
                                    {proj.cost && proj.cost > 0 && (
                                        <span className="text-xs text-red-400 flex items-center gap-1">
                                            <DollarSign size={12} />
                                            R$ {proj.cost.toLocaleString('pt-BR')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => onUpdateStatus(proj.id, proj.status === 'completed' ? 'planning' : 'completed')}
                                    className={`p-2 rounded-full transition-colors ${proj.status === 'completed' ? 'text-emerald-400 bg-emerald-900/20' : 'text-zinc-600 bg-zinc-900 hover:text-indigo-400'}`}
                                >
                                    {proj.status === 'completed' ? <CheckCircle size={20} /> : <Circle size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && <p className="text-zinc-500">Sem projetos futuros.</p>}
            </div>
        </div>

        {/* Mini Calendar View */}
        <div className="lg:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><CalendarIcon size={18} className="text-indigo-400"/> Próximos 30 Dias</h3>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-zinc-500 mb-2">
                <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-2 overflow-y-auto custom-scrollbar">
                {daysInMonth.map((day, i) => {
                    const dateStr = day.toISOString().split('T')[0];
                    const hasProject = projects.some(p => p.dueDate === dateStr);
                    const isToday = i === 0;

                    return (
                        <div key={i} className={`aspect-square flex flex-col items-center justify-center rounded-lg border 
                            ${isToday ? 'bg-indigo-900/30 border-indigo-500 text-white' : 'bg-zinc-800/30 border-transparent text-zinc-400'}
                            ${hasProject ? 'ring-1 ring-emerald-500' : ''}
                        `}>
                            <span className="font-medium">{day.getDate()}</span>
                            {hasProject && <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1"></div>}
                        </div>
                    )
                })}
            </div>
             <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg text-xs text-zinc-400">
                <p className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Dias com entregas</p>
                <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Hoje</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;

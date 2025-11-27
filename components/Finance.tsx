
import React, { useState } from 'react';
import { Transaction } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Plus } from 'lucide-react';

interface FinanceProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#14b8a6'];

const Finance: React.FC<FinanceProps> = ({ transactions, onAddTransaction }) => {
    const [showForm, setShowForm] = useState(false);
    const [newTrans, setNewTrans] = useState<Partial<Transaction>>({ type: 'expense' });

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const expenseByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            const existing = acc.find(a => a.name === curr.category);
            if (existing) existing.value += curr.amount;
            else acc.push({ name: curr.category, value: curr.amount });
            return acc;
        }, [] as { name: string, value: number }[]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTrans.amount && newTrans.description) {
            onAddTransaction({
                id: Date.now().toString(),
                date: newTrans.date || new Date().toISOString().split('T')[0],
                description: newTrans.description,
                amount: Number(newTrans.amount),
                type: newTrans.type || 'expense',
                category: newTrans.category || 'Geral'
            });
            setShowForm(false);
            setNewTrans({ type: 'expense' });
        }
    };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Financeiro</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Nova Transação
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Nova Movimentação</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4 p-1 bg-zinc-800 rounded-lg">
                        <button type="button" 
                            onClick={() => setNewTrans({...newTrans, type: 'income'})}
                            className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${newTrans.type === 'income' ? 'bg-emerald-600 text-white' : 'text-zinc-400'}`}>
                            Entrada
                        </button>
                        <button type="button" 
                             onClick={() => setNewTrans({...newTrans, type: 'expense'})}
                             className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${newTrans.type === 'expense' ? 'bg-red-600 text-white' : 'text-zinc-400'}`}>
                            Saída
                        </button>
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Descrição</label>
                        <input required type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white"
                            value={newTrans.description || ''} onChange={e => setNewTrans({...newTrans, description: e.target.value})} />
                    </div>
                     <div>
                        <label className="block text-sm text-zinc-400 mb-1">Valor (R$)</label>
                        <input required type="number" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white"
                            value={newTrans.amount || ''} onChange={e => setNewTrans({...newTrans, amount: Number(e.target.value)})} />
                    </div>
                     <div>
                        <label className="block text-sm text-zinc-400 mb-1">Categoria</label>
                        <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white"
                            value={newTrans.category || 'Geral'} onChange={e => setNewTrans({...newTrans, category: e.target.value})}>
                                <option value="Geral">Geral</option>
                                <option value="Show">Cachê Show</option>
                                <option value="Merch">Merch</option>
                                <option value="Equipamento">Equipamento</option>
                                <option value="Viagem">Viagem</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Pessoal">Pessoal</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm text-zinc-400 mb-1">Data</label>
                        <input required type="date" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white"
                            value={newTrans.date || ''} onChange={e => setNewTrans({...newTrans, date: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-zinc-400 hover:text-white">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <ArrowUpCircle className="text-emerald-500" />
                        <span className="text-zinc-400 text-sm">Entradas Totais</span>
                    </div>
                    <p className="text-2xl font-bold text-white">R$ {totalIncome.toLocaleString('pt-BR')}</p>
                </div>
                 <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <ArrowDownCircle className="text-red-500" />
                        <span className="text-zinc-400 text-sm">Saídas Totais</span>
                    </div>
                    <p className="text-2xl font-bold text-white">R$ {totalExpense.toLocaleString('pt-BR')}</p>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-zinc-800 font-semibold text-white">Últimas Transações</div>
                <div className="divide-y divide-zinc-800 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => (
                        <div key={t.id} className="p-4 flex justify-between items-center hover:bg-zinc-800/50">
                            <div>
                                <p className="text-white font-medium">{t.description}</p>
                                <p className="text-xs text-zinc-500">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                            </div>
                            <span className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {t.type === 'income' ? '+' : '-'} R$ {t.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Gastos por Categoria</h3>
            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={expenseByCategory}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {expenseByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                            ))}
                        </Pie>
                         <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend wrapperStyle={{fontSize: '12px', marginTop: '10px'}} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {expenseByCategory.length === 0 && <p className="text-center text-zinc-500 mt-4">Sem dados de despesas.</p>}
        </div>
      </div>
    </div>
  );
};

export default Finance;

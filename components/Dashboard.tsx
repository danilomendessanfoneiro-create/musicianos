
import React, { useState, useMemo } from 'react';
import { Gig, Lead, Transaction, LeadStatus } from '../types';
import { getManagerInsight } from '../services/geminiService';
import { Sparkles, TrendingUp, DollarSign, Calendar, Users, Filter } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  AreaChart, Area, Legend, ComposedChart, Line 
} from 'recharts';

interface DashboardProps {
  gigs: Gig[];
  leads: Lead[];
  finance: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ gigs, leads, finance }) => {
  const [insight, setInsight] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | '1Y' | 'ALL'>('6M');

  const totalIncome = finance
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = finance
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const nextGig = gigs
    .filter(g => new Date(g.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const activeLeads = leads.filter(l => l.status !== LeadStatus.LOST && l.status !== LeadStatus.BOOKED).length;

  const handleGetInsight = async () => {
    setLoadingAi(true);
    const result = await getManagerInsight(gigs, leads, finance);
    setInsight(result);
    setLoadingAi(false);
  };

  // --- Data Processing for Charts ---

  const filterDateByRange = (dateStr: string) => {
    if (timeRange === 'ALL') return true;
    const date = new Date(dateStr);
    const now = new Date();
    const months = timeRange === '3M' ? 3 : timeRange === '6M' ? 6 : 12;
    const pastDate = new Date();
    pastDate.setMonth(now.getMonth() - months);
    return date >= pastDate;
  };

  const chartData = useMemo(() => {
    const monthlyData: Record<string, { 
      name: string; 
      monthSort: number;
      income: number; 
      expense: number; 
      gigsCount: number;
      gigRevenue: number;
      leadsContacted: number;
    }> = {};

    // Helper to init month key
    const initMonth = (dateStr: string) => {
      const date = new Date(dateStr);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const name = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      if (!monthlyData[key]) {
        monthlyData[key] = { 
          name, 
          monthSort: date.getTime(), 
          income: 0, 
          expense: 0, 
          gigsCount: 0, 
          gigRevenue: 0,
          leadsContacted: 0 
        };
      }
      return key;
    };

    // Process Finance
    finance.filter(t => filterDateByRange(t.date)).forEach(t => {
      const key = initMonth(t.date);
      if (t.type === 'income') monthlyData[key].income += t.amount;
      else monthlyData[key].expense += t.amount;
    });

    // Process Gigs
    gigs.filter(g => filterDateByRange(g.date)).forEach(g => {
      const key = initMonth(g.date);
      monthlyData[key].gigsCount += 1;
      monthlyData[key].gigRevenue += g.fee;
    });

    // Process Leads (using lastContact as proxy for activity period)
    leads.filter(l => filterDateByRange(l.lastContact)).forEach(l => {
      const key = initMonth(l.lastContact);
      monthlyData[key].leadsContacted += 1;
    });

    return Object.values(monthlyData).sort((a, b) => a.monthSort - b.monthSort);
  }, [finance, gigs, leads, timeRange]);

  // Simple data for the small "Fluxo de Caixa" bar chart (Totals)
  const totalFlowData = [
    { name: 'Receitas', value: totalIncome },
    { name: 'Despesas', value: totalExpense },
    { name: 'Lucro', value: totalIncome - totalExpense },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-zinc-400">Visão geral da sua carreira</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-1 flex items-center">
             <Filter size={14} className="ml-2 text-zinc-500" />
             <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="bg-transparent text-white text-sm p-2 outline-none cursor-pointer"
             >
               <option value="3M">Últimos 3 Meses</option>
               <option value="6M">Últimos 6 Meses</option>
               <option value="1Y">Último Ano</option>
               <option value="ALL">Todo Período</option>
             </select>
          </div>

          <button
            onClick={handleGetInsight}
            disabled={loadingAi}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 text-sm"
          >
            <Sparkles size={16} />
            {loadingAi ? 'Analisando...' : 'Pedir Insight IA'}
          </button>
        </div>
      </div>

      {insight && (
        <div className="bg-zinc-800/80 border border-indigo-500/30 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500"></div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Sparkles className="text-purple-400" size={20} /> Manager AI diz:
          </h3>
          <div className="prose prose-invert max-w-none text-zinc-300 whitespace-pre-line">
            {insight}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Saldo Atual" 
          value={`R$ ${(totalIncome - totalExpense).toLocaleString('pt-BR')}`} 
          icon={<DollarSign className="text-emerald-400" />} 
          trend={+12}
        />
        <StatCard 
          title="Próximo Show" 
          value={nextGig ? `${new Date(nextGig.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}` : 'Nenhum'} 
          subValue={nextGig?.venue || '-'}
          icon={<Calendar className="text-blue-400" />} 
        />
        <StatCard 
          title="Leads Ativos" 
          value={activeLeads.toString()} 
          icon={<Users className="text-orange-400" />} 
        />
        <StatCard 
          title="Faturamento Total" 
          value={`R$ ${totalIncome.toLocaleString('pt-BR')}`} 
          icon={<TrendingUp className="text-indigo-400" />} 
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Shows & Revenue Trend */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">Performance de Shows</h3>
          <p className="text-xs text-zinc-500 mb-6">Quantidade de shows vs Receita gerada no período</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" tick={{fill: '#a1a1aa', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" stroke="#71717a" tick={{fill: '#a1a1aa', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value/1000}k`}/>
                <YAxis yAxisId="right" orientation="right" stroke="#71717a" tick={{fill: '#a1a1aa', fontSize: 12}} axisLine={false} tickLine={false}/>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                  cursor={{fill: '#27272a'}}
                />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="gigRevenue" name="Receita de Shows" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" />
                <Line yAxisId="right" type="monotone" dataKey="gigsCount" name="Qtd Shows" stroke="#10b981" strokeWidth={2} dot={{r: 4}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Leads Activity */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">Atividade de Leads</h3>
          <p className="text-xs text-zinc-500 mb-6">Volume de leads contactados/ativos por mês</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" tick={{fill: '#a1a1aa', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#71717a" tick={{fill: '#a1a1aa', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                  cursor={{fill: '#27272a'}}
                />
                <Area type="monotone" dataKey="leadsContacted" name="Leads Ativos" stroke="#f97316" fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Fluxo de Caixa Total</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={totalFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" tick={{fill: '#a1a1aa'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#71717a" tick={{fill: '#a1a1aa'}} axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                  cursor={{fill: '#27272a'}}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Shows Recentes</h3>
          <div className="space-y-4">
            {gigs.slice(0, 4).map(gig => (
              <div key={gig.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                <div className="flex flex-col">
                  <span className="font-medium text-white">{gig.venue}</span>
                  <span className="text-xs text-zinc-400">{gig.city}</span>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-white">R$ {gig.fee}</span>
                  <span className="text-xs text-zinc-500">{new Date(gig.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {gigs.length === 0 && <p className="text-zinc-500 text-center py-4">Nenhum show recente.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subValue, icon, trend }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        {subValue && <p className="text-sm text-zinc-500 mt-1">{subValue}</p>}
      </div>
      <div className="p-2 bg-zinc-800 rounded-lg">
        {icon}
      </div>
    </div>
    {trend && (
      <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
        <TrendingUp size={12} />
        <span>+{trend}% vs mês passado</span>
      </div>
    )}
  </div>
);

export default Dashboard;

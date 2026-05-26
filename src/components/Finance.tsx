import React from 'react';
import { GlassCard } from './GlassCard';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  History
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const incomeData = [
  { month: 'Jan', income: 45000, expense: 32000 },
  { month: 'Feb', income: 52000, expense: 34000 },
  { month: 'Mar', income: 48000, expense: 35000 },
  { month: 'Apr', income: 61000, expense: 40000 },
  { month: 'May', income: 58000, expense: 42000 },
  { month: 'Jun', income: 72000, expense: 45000 },
];

const categoryData = [
  { name: 'Inventory', value: 45, color: '#06b6d4' },
  { name: 'Payroll', value: 30, color: '#8b5cf6' },
  { name: 'Marketing', value: 15, color: '#ec4899' },
  { name: 'Overhead', value: 10, color: '#f59e0b' },
];

export const Finance: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard title="Current Balance" icon={CreditCard}>
           <div className="mt-2">
              <h4 className="text-4xl font-bold text-white tracking-tighter">$124,592.00</h4>
              <p className="text-cyan-400 text-[10px] font-bold mt-1 uppercase tracking-widest">+12.5% FROM LAST PULSE</p>
           </div>
        </GlassCard>
        
        <GlassCard title="Monthly Income" icon={ArrowUpRight}>
           <div className="mt-2">
              <h4 className="text-4xl font-bold text-green-400 tracking-tighter">$72,400.00</h4>
              <p className="text-gray-600 text-[10px] font-bold mt-1 uppercase tracking-widest">Validated Net Gain</p>
           </div>
        </GlassCard>

        <GlassCard title="Monthly Expense" icon={ArrowDownLeft}>
           <div className="mt-2">
              <h4 className="text-4xl font-bold text-red-400 tracking-tighter">$45,820.00</h4>
              <p className="text-gray-600 text-[10px] font-bold mt-1 uppercase tracking-widest">Network Overhead</p>
           </div>
        </GlassCard>

        <GlassCard title="Net Profit" icon={Activity}>
           <div className="mt-2 text-cyan-400">
              <h4 className="text-4xl font-bold text-white tracking-tighter">$26,580.00</h4>
              <p className="text-cyan-400 text-[10px] font-bold mt-1 uppercase tracking-widest">36.7% PROFIT MARGIN</p>
           </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <GlassCard title="Cash Flow Matrix" icon={BarChart3} className="lg:col-span-2">
          <div className="h-80 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#666" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0d0d12', 
                    border: '1px solid #ffffff10',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#22d3ee" 
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorExpense)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Expenditure Breakdown */}
        <GlassCard title="Expenditure Delta" icon={PieChartIcon}>
          <div className="h-64 w-full mt-6">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                   <XAxis type="number" hide />
                   <YAxis 
                    dataKey="name" 
                    type="category" 
                    hide
                   />
                   <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ 
                        backgroundColor: '#0d0d12', 
                        border: '1px solid #ffffff10',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }} 
                   />
                   <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} />
                      ))}
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>

          <div className="space-y-3 mt-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-400 font-medium">{item.name}</span>
                </div>
                <span className="text-xs font-mono text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard title="Recent Ledger Entries" icon={History}>
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                <th className="px-6 py-4 font-medium">Identifier</th>
                <th className="px-6 py-4 font-medium">Recipient / Source</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-right">Value</th>
                <th className="px-6 py-4 font-medium text-center">Protocol</th>
                <th className="px-6 py-4 font-medium text-right pr-10">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { id: 'TXN_9921', entity: 'Cloud Infra Services', cat: 'Overhead', amt: -450.00, method: 'Card', time: '14:20:05' },
                { id: 'TXN_9920', entity: 'Client: Sarah Connor', cat: 'Income', amt: 1200.00, method: 'M-Pesa', time: '11:45:12' },
                { id: 'TXN_9919', entity: 'Office Space Rental', cat: 'Rent', amt: -2500.00, method: 'Transfer', time: '09:00:00' },
                { id: 'TXN_9918', entity: 'Hardware Refresh', cat: 'Inventory', amt: -1240.20, method: 'Card', time: 'Yesterday' },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-4 font-mono text-[10px] text-cyan-400">{row.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-white">{row.entity}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] font-bold uppercase tracking-widest text-gray-400">{row.cat}</span>
                  </td>
                  <td className={cn(
                    "px-6 py-4 text-right font-mono text-sm font-bold",
                    row.amt < 0 ? "text-red-400" : "text-green-400"
                  )}>
                    {row.amt < 0 ? `-` : `+`}${Math.abs(row.amt).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 bg-cyan-400/5 text-cyan-400 rounded text-[9px] font-bold border border-cyan-400/10 uppercase">{row.method}</span>
                  </td>
                  <td className="px-6 py-4 text-right pr-10 text-[10px] text-gray-600 font-mono italic">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

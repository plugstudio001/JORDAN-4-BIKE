import React from 'react';
import { motion } from 'motion/react';
import { GlowCard } from './GlowCard';
import { StatCard } from './StatCard';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  AlertCircle, 
  ArrowUpRight, 
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { cn } from '../lib/utils';

const data = [
  { name: '00:00', sales: 4000, orders: 240 },
  { name: '04:00', sales: 3000, orders: 198 },
  { name: '08:00', sales: 2000, orders: 150 },
  { name: '12:00', sales: 2780, orders: 300 },
  { name: '16:00', sales: 1890, orders: 180 },
  { name: '20:00', sales: 2390, orders: 210 },
  { name: '23:59', sales: 3490, orders: 250 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Revenue" value="$128.4k" delta="+12.5%" icon={TrendingUp} color="text-cyan-400" />
        <StatCard label="Live Orders" value="1,240" delta="+4.2%" icon={ShoppingBag} color="text-purple-400" />
        <StatCard label="Active Customers" value="458" delta="+8.1%" icon={Users} color="text-green-400" />
        <StatCard label="Node Health" value="98.5%" delta="-0.2%" isPositive={false} icon={Activity} color="text-yellow-400" />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlowCard className="lg:col-span-2 min-h-[400px] p-6">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Performance Matrix</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Real-time Transaction Density</p>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em]">Live_Feed</span>
             </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }}
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(5,5,7,0.9)', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#22d3ee" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlowCard>

        <GlowCard className="p-6 h-full">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Active Stream</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Transaction Log Index</p>
            </div>
          </div>

          <div className="space-y-6">
            {[
              { user: 'Sarah Mills', action: 'processed an invoice for', item: '$4,200', time: '2m ago', color: 'cyan' },
              { user: 'Node Pulse', action: 'detected a spike in', item: 'inventory', time: '12m ago', color: 'purple' },
              { user: 'James Chen', action: 'completed order', item: '#TR-8921', time: '45m ago', color: 'cyan' },
              { user: 'Alpha Corp', action: 'joined loyalty', item: 'tier 2', time: '1h ago', color: 'green' },
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-3 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5",
                  log.color === 'cyan' ? 'bg-cyan-400' : log.color === 'purple' ? 'bg-purple-500' : 'bg-green-500'
                )} />
                <div className="flex-1">
                  <p className="text-[11px] leading-relaxed">
                    <span className="font-bold text-white/90">{log.user}</span>
                    <span className="text-gray-500 mx-1">{log.action}</span>
                    <span className={cn(
                       "font-bold",
                       log.color === 'cyan' ? 'text-cyan-400' : log.color === 'purple' ? 'text-purple-400' : 'text-green-400'
                    )}>{log.item}</span>
                  </p>
                  <p className="text-[10px] font-bold text-gray-700 mt-1 uppercase tracking-tighter">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-cyan-400/10 hover:text-cyan-400 transition-all border border-white/5">
            ACCESS_PROTOCOL_LOGS
          </button>
        </GlowCard>
      </div>

      {/* AI Recommendation Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cyan-400/5 backdrop-blur-xl border border-cyan-400/20 rounded-3xl p-8 flex items-center gap-8 group"
      >
        <div className="w-16 h-16 bg-cyan-400/10 border border-cyan-400/20 rounded-2xl flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover:scale-110 transition-transform">
          <Target className="w-8 h-8 animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em]">Neural Intelligence Recommendation</p>
          <p className="text-lg text-white font-bold mt-1 tracking-tight leading-7">Customer retention is projected to rise <span className="text-green-400">18%</span> if loyalty automation is activated today. <span className="text-gray-500 font-normal">Shall I initialize the optimization sequence?</span></p>
        </div>
        <button className="bg-white text-black text-[10px] px-8 py-4 rounded-2xl font-bold transition-all uppercase tracking-widest shadow-xl hover:bg-cyan-400 hover:text-white transform hover:scale-105 active:scale-95">
          Execute Sequence
        </button>
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Zap, TrendingUp, AlertCircle, Sparkles, Brain, Cpu, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const predictionData = [
  { name: 'Week 1', actual: 4000, prediction: 4200 },
  { name: 'Week 2', actual: 3000, prediction: 3100 },
  { name: 'Week 3', actual: 5000, prediction: 5200 },
  { name: 'Week 4', actual: 4500, prediction: 4800 },
  { name: 'Week 5', prediction: 5500 },
  { name: 'Week 6', prediction: 5900 },
  { name: 'Week 7', prediction: 6200 },
];

export const Insights: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const performDeepAnalysis = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { 
          sales: [4000, 3000, 5000, 4500],
          inventory: ["Quantum Chips: 5 left", "Matrix Cores: 120 left"],
          customers: "458 total, 12% churn"
        }})
      });
      const result = await response.json();
      setInsights(result.insights);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* AI Header */}
      <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 text-blue-400 mb-4 font-mono text-sm tracking-widest uppercase">
            <Cpu className="w-5 h-5" /> Neural Engine Active
          </div>
          <h2 className="text-4xl font-bold mb-4 tracking-tight leading-tight">Predictive Business Intelligence</h2>
          <p className="text-white/60 text-lg">Our advanced neural network analyzes millions of data points across your inventory, sales, and customer behavior to forecast the future of your enterprise.</p>
          <div className="flex gap-4 mt-8">
            <button 
              onClick={performDeepAnalysis}
              disabled={analyzing}
              className="px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-blue-400 hover:text-white transition-all disabled:opacity-50"
            >
              {analyzing ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <Brain className="w-6 h-6" />}
              {analyzing ? 'Synchronizing Neural Paths...' : 'Begin Deep Analysis'}
            </button>
            <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
              Schedule Weekly Report
            </button>
          </div>
        </div>
        <div className="w-64 h-64 relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-full h-full border-4 border-dashed border-blue-500/30 rounded-full flex items-center justify-center p-8"
          >
           <motion.div 
             animate={{ rotate: -360 }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="w-full h-full border-2 border-dashed border-purple-500/30 rounded-full"
           />
          </motion.div>
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-white animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard title="Revenue Forecast" subtitle="Next 3 weeks prediction matrix" className="min-h-[450px]">
          <div className="h-[350px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData}>
                <defs>
                  <linearGradient id="actual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="prediction" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}
                />
                <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} fill="url(#actual)" />
                <Area type="monotone" dataKey="prediction" stroke="#a855f7" strokeWidth={3} strokeDasharray="10 5" fill="url(#prediction)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-white/30 uppercase tracking-[0.2em] font-mono mt-4">Confidence Interval: 94.2%</p>
        </GlassCard>

        <div className="space-y-8">
          <GlassCard title="Real-time Anomalies" icon={AlertCircle}>
            <div className="space-y-4 mt-2">
               <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <TrendingUp className="w-5 h-5 text-orange-400" />
                   <span className="text-sm font-semibold">Unusual Sales Spike</span>
                 </div>
                 <span className="text-xs font-mono text-orange-400">+240% IN 1H</span>
               </div>
               <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Sparkles className="w-5 h-5 text-red-400" />
                   <span className="text-sm font-semibold">Security Variance</span>
                 </div>
                 <span className="text-xs font-mono text-red-400">NODE_FAILED</span>
               </div>
            </div>
          </GlassCard>

          <GlassCard title="Matrix Insights" icon={Brain} className="flex-1">
            <div className="prose prose-invert prose-sm">
              {insights ? (
                <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
                  {insights}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-20 text-center">
                  <Sparkles className="w-12 h-12 mb-4 animate-bounce" />
                  <p>Neural paths waiting for initialization.</p>
                </div>
              )}
            </div>
            {insights && (
              <button className="w-full mt-6 py-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                Export Strategic Plan
              </button>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};



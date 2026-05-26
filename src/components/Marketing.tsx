import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Megaphone, Send, Smartphone, Mail, Globe, Sparkles, RefreshCcw, BarChart2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Marketing: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('social');
  const [generating, setGenerating] = useState(false);
  const [copies, setCopies] = useState<string | null>(null);

  const generateAdCopy = async () => {
    if (!topic) return;
    setGenerating(true);
    try {
      const response = await fetch('/api/ai/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform })
      });
      const result = await response.json();
      setCopies(result.copies);
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard title="Campaign Orchestrator" icon={Megaphone} className="lg:col-span-1">
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-widest ml-2">Objective Variable</label>
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Flash sale on Matrix Chips"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-purple-500/50 outline-none" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-widest ml-2">Target Channel</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'social', icon: Globe, label: 'Social' },
                  { id: 'email', icon: Mail, label: 'Email' },
                  { id: 'sms', icon: Smartphone, label: 'SMS' },
                  { id: 'push', icon: Megaphone, label: 'Push' },
                ].map((c) => (
                  <button 
                    key={c.id}
                    onClick={() => setPlatform(c.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${platform === c.id ? 'bg-purple-500/20 border-purple-500/50 text-white' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                  >
                    <c.icon className="w-4 h-4" />
                    <span className="text-xs font-bold">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={generateAdCopy}
              disabled={generating || !topic}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-30 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              {generating ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {generating ? 'GENERATING_COPY' : 'Synthesis Ad Copy'}
            </button>
          </div>
        </GlassCard>

        <div className="lg:col-span-2 space-y-8">
          <GlassCard title="Neural Output" icon={Sparkles} className="min-h-[250px]">
             {copies ? (
               <div className="prose prose-invert max-w-none">
                 <div className="text-white/80 whitespace-pre-wrap leading-relaxed text-lg italic border-l-4 border-purple-500 pl-6 py-2">
                   {copies}
                 </div>
                 <div className="flex gap-4 mt-8">
                    <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
                      <Send className="w-4 h-4" /> Launch Campaign
                    </button>
                    <button onClick={() => setCopies(null)} className="text-white/20 hover:text-white text-xs underline">Clear Output</button>
                 </div>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 text-center">
                 <RefreshCcw className="w-16 h-16 mb-4" />
                 <p className="text-xl">Standby for AI content synthesis</p>
               </div>
             )}
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard title="Live Reach" icon={BarChart2}>
              <div className="flex items-end justify-between h-32 gap-2 pb-2">
                {[30, 45, 25, 60, 80, 55, 90, 70].map((h, i) => (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-purple-600/50 to-blue-500 rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  />
                ))}
              </div>
              <div className="flex justify-between items-center mt-6">
                <span className="text-4xl font-bold">12k+</span>
                <span className="text-green-400 font-mono text-sm">+18.2%</span>
              </div>
              <p className="text-xs text-white/20 mt-1 uppercase tracking-widest font-mono">Real-time impressions</p>
            </GlassCard>

            <GlassCard title="Conversion Path" icon={TrendingUp}>
               <div className="space-y-4 mt-2">
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-white/60">Click-through Matrix</span>
                   <span className="text-blue-400 font-mono">4.8%</span>
                 </div>
                 <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[48%]" />
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-white/60">Conversion Rate</span>
                   <span className="text-purple-400 font-mono">1.2%</span>
                 </div>
                 <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-[12%]" />
                 </div>
               </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

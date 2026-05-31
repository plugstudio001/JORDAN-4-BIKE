import React, { useState } from 'react';
import { GlowCard } from './GlowCard';
import { Megaphone, Send, Smartphone, Mail, Globe, Sparkles, RefreshCcw, BarChart2, TrendingUp, Cpu } from 'lucide-react';
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
      // Simulate synthesis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCopies(`[PULSE_GENERATED_COPY]\n\nElevate your enterprise with ${topic}. Our quantum-enhanced matrix synchronization ensures peak node performance across all terrestrial sectors.\n\n#PulseGrid #FutureTech #BusinessSync`);
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlowCard className="lg:col-span-1 p-8" hoverEffect={false}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-purple-500/10 rounded-lg">
                <Megaphone className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight">Campaign Orchestrator</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Aesthetic Optimization</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold ml-1">Objective_Parameter</label>
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Flash sale on Matrix Chips"
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white placeholder:text-white/10 focus:ring-1 ring-purple-500/50 outline-none transition-all" 
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold ml-1">Distribution_Channel</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'social', icon: Globe, label: 'SOCIAL' },
                  { id: 'email', icon: Mail, label: 'EMAIL' },
                  { id: 'sms', icon: Smartphone, label: 'SMS' },
                  { id: 'push', icon: Megaphone, label: 'PUSH' },
                ].map((c) => (
                  <button 
                    key={c.id}
                    onClick={() => setPlatform(c.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${platform === c.id ? 'bg-purple-500/10 border-purple-500/40 text-purple-400' : 'bg-white/[0.02] border-white/5 text-white/20 hover:bg-white/[0.05]'}`}
                  >
                    <c.icon className="w-5 h-5 mb-2" />
                    <span className="text-[9px] font-bold tracking-widest">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={generateAdCopy}
              disabled={generating || !topic}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-5 rounded-[24px] font-bold flex items-center justify-center gap-3 hover:brightness-110 disabled:opacity-30 transition-all shadow-[0_0_40px_rgba(168,85,247,0.2)] active:scale-95 uppercase tracking-widest"
            >
              {generating ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Cpu className="w-5 h-5" />}
              {generating ? 'SYNTHESIZING...' : 'Initialize Synthesis'}
            </button>
          </div>
        </GlowCard>

        <div className="lg:col-span-2 space-y-8">
          <GlowCard className="min-h-[300px] p-8 overflow-hidden relative" hoverEffect={false}>
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
             
             <div className="flex items-center gap-3 mb-8 relative z-10">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold uppercase tracking-tight">Neural Output Buffer</h3>
             </div>

             {copies ? (
               <div className="space-y-8 relative z-10">
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white/80 whitespace-pre-wrap leading-relaxed text-lg font-medium border-l-2 border-purple-500/50 pl-8 py-4 bg-white/[0.02] rounded-r-2xl"
                 >
                   {copies}
                 </motion.div>
                 <div className="flex items-center gap-6">
                    <button className="bg-white text-black px-8 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 hover:bg-purple-500 hover:text-white transition-all shadow-xl uppercase tracking-widest">
                      <Send className="w-4 h-4" /> Trigger Sequence
                    </button>
                    <button onClick={() => setCopies(null)} className="text-white/20 hover:text-white text-[10px] uppercase tracking-widest font-bold underline transition-colors">Abort_Output</button>
                 </div>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center py-20 text-center relative z-10">
                 <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 opacity-20 border border-white/10">
                    <RefreshCcw className="w-10 h-10" />
                 </div>
                 <p className="text-xl font-bold text-gray-700 uppercase tracking-widest">Awaiting Parameter Vector</p>
                 <p className="text-[10px] text-gray-800 uppercase tracking-[0.4em] mt-2 font-bold">Input objective to initialize synthesis</p>
               </div>
             )}
          </GlowCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlowCard className="p-8" hoverEffect={false}>
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-cyan-400" /> Live_Reach_Matrix
                </h4>
                <span className="text-green-500 font-mono text-[10px] font-bold tracking-widest bg-green-500/10 px-2 py-1 rounded">+18.2%</span>
              </div>
              
              <div className="flex items-end justify-between h-24 gap-1.5 mb-8">
                {[30, 45, 25, 60, 80, 55, 90, 70, 85, 40, 65, 50].map((h, i) => (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-purple-500/20 to-blue-400/40 rounded-t-sm border-t border-cyan-400/20"
                  />
                ))}
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tighter">12,482</span>
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest uppercase">impressions</span>
              </div>
            </GlowCard>

            <GlowCard className="p-8" hoverEffect={false}>
              <div className="flex items-center mb-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" /> Conversion_Vector
                </h4>
              </div>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">CTR_PULSE</span>
                    <span className="text-cyan-400 font-mono text-sm font-bold">4.8%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-[48%] shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">CONVERSION_LOAD</span>
                    <span className="text-purple-400 font-mono text-sm font-bold">1.2%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-[12%] shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  );
};

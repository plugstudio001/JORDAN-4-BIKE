import React from 'react';
import { LucideIcon } from 'lucide-react';
import { GlowCard } from './GlowCard';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  delta, 
  isPositive = true, 
  icon: Icon, 
  color = "text-cyan-400" 
}) => {
  return (
    <GlowCard className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{label}</p>
          <h4 className="text-3xl font-bold text-white tracking-tighter">{value}</h4>
          {delta && (
            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <span className="px-1.5 py-0.5 bg-current/10 rounded">{delta}</span>
              <span className="opacity-50">vs last pulse</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${color} shadow-[0_0_20px_rgba(255,255,255,0.02)]`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </GlowCard>
  );
};

import React from 'react';
import { GlassCard } from './GlassCard';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Zap,
  Clock,
  Settings,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const notifications = [
  {
    id: 1,
    type: 'critical',
    title: 'Low Stock Threshold Breached',
    description: 'Quantum Processor X1 inventory levels have fallen below critical limit (2 units remaining).',
    time: '2 minutes ago',
    icon: AlertTriangle,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20'
  },
  {
    id: 2,
    type: 'success',
    title: 'Node Payment Synchronized',
    description: 'Transaction TXN_4421 from Amara Osei has been successfully verified on the matrix.',
    time: '15 minutes ago',
    icon: CheckCircle2,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20'
  },
  {
    id: 3,
    type: 'ai',
    title: 'AI Insight Generated',
    description: 'New predictive model suggests a 15% increase in demand for neural interface nodes next week.',
    time: '1 hour ago',
    icon: Zap,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    borderColor: 'border-cyan-400/20'
  },
  {
    id: 4,
    type: 'security',
    title: 'Access Protocol Breach',
    description: 'Unauthorized login attempt detected from unrecognized node identifier in Sector 7.',
    time: '3 hours ago',
    icon: ShieldAlert,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20'
  },
  {
    id: 5,
    type: 'info',
    title: 'System Update Completed',
    description: 'PulseGrid OS v4.2.0 has been deployed. New financial matrix protocols are now active.',
    time: '5 hours ago',
    icon: Info,
    color: 'text-white/60',
    bgColor: 'bg-white/5',
    borderColor: 'border-white/10'
  }
];

export const Notifications: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-400/10 border border-cyan-400/20 rounded-2xl">
            <Bell className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Notification Feed</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Real-time System Audit Stream</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:bg-white/10 transition-all">
            Archive All
          </button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <GlassCard 
            key={notif.id} 
            className={cn(
              "group transition-all hover:translate-x-1 duration-300",
              notif.type === 'critical' ? 'border-red-400/20 hover:border-red-400/40' : 'hover:border-cyan-400/30'
            )}
          >
            <div className="flex gap-6">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-transform group-hover:scale-110",
                notif.bgColor,
                notif.borderColor,
                notif.color
              )}>
                <notif.icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">
                      {notif.title}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1 leading-relaxed max-w-2xl">
                      {notif.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{notif.time}</span>
                    </div>
                    {notif.type === 'critical' && (
                      <span className="px-2 py-0.5 bg-red-400/10 text-red-400 text-[8px] font-bold rounded uppercase animate-pulse border border-red-400/20">
                        Immediate Action Required
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                      Mark as Read
                    </button>
                    <span className="text-gray-800">|</span>
                    <button className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                      Dismiss
                    </button>
                  </div>
                  
                  <button className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold uppercase tracking-widest group/btn">
                    Execute Protocol <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
      
      <div className="py-12 text-center opacity-20 group hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">End of Matrix Feed</p>
        <div className="w-px h-12 bg-gradient-to-b from-white/10 to-transparent mx-auto mt-4" />
      </div>
    </div>
  );
};

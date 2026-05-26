import React from 'react';
import { GlassCard } from './GlassCard';
import { 
  Shield, 
  Lock, 
  Globe, 
  Bell, 
  Moon, 
  Database, 
  Trash2, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { auth } from '../lib/firebase';

export const Settings: React.FC = () => {
  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard title="Security Protocol" icon={Shield}>
          <div className="space-y-6 mt-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-semibold text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-white/30">Biometric enforcement enabled</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="font-semibold text-sm">Real-time DB Sync</p>
                  <p className="text-xs text-white/30">Firebase Cloud Mesh Connection</p>
                </div>
              </div>
              <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-lg" />
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Interface Parameters" icon={Moon}>
          <div className="space-y-6 mt-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-green-400" />
                <p className="font-semibold text-sm">Neural Language</p>
              </div>
              <select className="bg-transparent text-sm text-white focus:outline-none cursor-pointer font-bold">
                <option>English (Global)</option>
                <option>Binary Code</option>
                <option>Spanish</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-yellow-400" />
                <p className="font-semibold text-sm">Push Overlays</p>
              </div>
              <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-lg" />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard title="System DANGER ZONE" className="border-red-500/20 bg-red-500/5">
        <div className="space-y-4 mt-2">
          <p className="text-sm text-red-400/80">The following actions are irreversible. Immediate data vaporization may occur.</p>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold hover:bg-red-500/20 transition-all text-sm">
              <Trash2 className="w-4 h-4" /> Purge Matrix Cache
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/10 text-white font-bold hover:bg-white/20 transition-all text-sm"
            >
              <LogOut className="w-4 h-4" /> Terminate Session
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="text-center space-y-2 opacity-20 hover:opacity-100 transition-opacity">
        <p className="font-mono text-xs uppercase tracking-[0.5em]">PulseGrid OS v4.0.2-BETA</p>
        <p className="text-[10px]">BUILD_ID: AI-STUDIO-51582719</p>
      </div>
    </div>
  );
};

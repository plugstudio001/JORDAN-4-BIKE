/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { POS } from './components/POS';
import { Employees } from './components/Employees';
import { Customers } from './components/Customers';
import { Insights } from './components/Insights';
import { Marketing } from './components/Marketing';
import { Settings } from './components/Settings';
import { Finance } from './components/Finance';
import { Notifications } from './components/Notifications';
import { AIAssistant } from './components/AIAssistant';
import { auth, signInWithGoogle, testConnection } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Zap, LogIn } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'sales': return <POS />;
      case 'employees': return <Employees />;
      case 'customers': return <Customers />;
      case 'insights': return <Insights />;
      case 'marketing': return <Marketing />;
      case 'finance': return <Finance />;
      case 'notifications': return <Notifications />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#050507] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.3)]"
        >
          <Zap className="text-white w-8 h-8" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen bg-[#050507] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-50px] right-[100px] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-md w-full bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[40px] text-center relative z-10"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,211,238,0.3)]">
            <Zap className="text-white w-10 h-10" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">PulseGrid AI</h1>
          <p className="text-gray-400 mb-10 text-lg">Next-generation business intelligence. Synchronize your enterprise matrix.</p>
          
          <button
            onClick={signInWithGoogle}
            className="w-full bg-white text-black py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-cyan-400 hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl"
          >
            <LogIn className="w-5 h-5" />
            Initialize Sequence
          </button>
          
          <p className="text-white/10 mt-8 text-[10px] uppercase tracking-[0.4em] font-mono">Quantum Level Security Enabled</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050507] text-[#e0e0e0] overflow-hidden font-sans relative">
      {/* Background Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-50px] right-[100px] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 relative overflow-y-auto px-10 py-8 custom-scrollbar z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  PulseGrid 
                  <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] rounded-full uppercase tracking-widest font-bold">
                    {activeTab === 'dashboard' ? 'AI COMMAND CENTER' : activeTab.replace('-', ' ').toUpperCase()}
                  </span>
                </h2>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-semibold">
                  System Status: Stable • Node Synchronization Activity
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3 text-xs">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  <span className="text-gray-400 font-mono">CORE_CONNECTED</span>
                </div>
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <div className="text-right">
                    <p className="text-xs font-bold text-white/90">{user.displayName}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-tighter">Authorized Operator</p>
                  </div>
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-xl border border-white/10 p-0.5 bg-white/5"
                  />
                </div>
              </div>
            </div>

            {renderContent()}
          </motion.div>
        </AnimatePresence>
        
        <AIAssistant />
      </main>
    </div>
  );
}


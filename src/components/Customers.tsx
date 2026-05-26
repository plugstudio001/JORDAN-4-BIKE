import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { UserCircle, Star, MessageSquare, Bell, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Customer } from '../types';

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const q = query(collection(db, "customers"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const custs: Customer[] = [];
      snapshot.forEach((doc) => custs.push({ id: doc.id, ...doc.data() } as Customer));
      setCustomers(custs);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard title="User Index" icon={UserCircle} className="col-span-2">
          <div className="flex items-center justify-between mt-1">
            <div>
              <h4 className="text-4xl font-bold text-white">{customers.length}</h4>
              <p className="text-gray-600 text-[10px] mt-1 font-mono uppercase tracking-[0.2em] font-bold">ENCRYPTED ENTITIES</p>
            </div>
            <div className="h-16 w-32 bg-cyan-500/10 rounded-2xl flex items-end p-2 gap-1 overflow-hidden border border-cyan-500/10">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <div key={i} className="flex-1 bg-cyan-400/40 rounded-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </GlassCard>
        <GlassCard title="Avg Loyalty" icon={Star}>
           <div className="mt-1">
              <h4 className="text-4xl font-bold text-yellow-400">4,280</h4>
              <p className="text-gray-600 text-[10px] mt-1 font-mono uppercase tracking-[0.2em] font-bold">PULSE POINTS</p>
           </div>
        </GlassCard>
        <GlassCard title="Feedback" icon={MessageSquare}>
           <div className="mt-1">
              <h4 className="text-4xl font-bold text-purple-400">+92</h4>
              <p className="text-gray-600 text-[10px] mt-1 font-mono uppercase tracking-[0.2em] font-bold">NPS SCORE</p>
           </div>
        </GlassCard>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search human database..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all backdrop-blur-xl"
          />
        </div>
        <div className="flex gap-4">
          <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-gray-500">
            <Filter className="w-5 h-5" />
          </button>
          <button className="bg-white text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-cyan-400 hover:text-white transition-all text-xs uppercase tracking-widest shadow-lg">
            <Bell className="w-5 h-5" /> Broadcast Message
          </button>
        </div>
      </div>

      <GlassCard className="!p-0 border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                <th className="px-6 py-5 font-medium">Identity</th>
                <th className="px-6 py-5 font-medium">Contact Channel</th>
                <th className="px-6 py-5 font-medium text-center">Loyalty Tier</th>
                <th className="px-6 py-5 font-medium text-right pr-10">Activity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 transition-transform group-hover:scale-105">
                        {cust.name[0]}
                      </div>
                      <span className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{cust.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400 font-medium">{cust.email}</span>
                      <span className="text-[10px] text-gray-700 font-mono tracking-tighter">{cust.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 bg-yellow-500/5 text-yellow-500 border border-yellow-500/10 rounded-lg text-[9px] font-bold uppercase tracking-widest leading-none">
                      {cust.loyaltyPoints > 5000 ? 'Platinum' : 'Gold'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right pr-10">
                    <div className="flex items-center justify-end gap-2">
                       <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                       <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">ONLINE_NOW</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && (
            <div className="py-20 text-center opacity-10">
               <UserCircle className="w-16 h-16 mx-auto mb-4" />
               <p className="text-lg font-bold uppercase tracking-[0.3em]">No biometric data discovered.</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

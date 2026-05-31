import React, { useState, useEffect } from 'react';
import { GlowCard } from './GlowCard';
import { StatCard } from './StatCard';
import { Users, UserPlus, Shield, Activity, Clock, DollarSign, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Employee } from '../types';

export const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const q = query(collection(db, "employees"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const emps: Employee[] = [];
      snapshot.forEach((doc) => emps.push({ id: doc.id, ...doc.data() } as Employee));
      setEmployees(emps);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8 pb-20">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Personnel" value={employees.length} icon={Users} color="text-cyan-400" />
        <StatCard label="Attendance Rate" value="98.5%" delta="+0.2%" icon={Activity} color="text-green-400" />
        <StatCard label="Active Sessions" value="4 Active" icon={UserCheck} color="text-purple-400" />
      </div>

      {/* Directory and Action Bar */}
      <GlowCard className="p-4" hoverEffect={false}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold ml-2 uppercase tracking-[0.2em] text-cyan-400">Node Directory</h3>
            <p className="text-[10px] text-gray-500 ml-2 font-bold uppercase tracking-widest mt-0.5">Authorized Enterprise Personnel</p>
          </div>
          <button className="bg-white text-black px-8 py-3 rounded-2xl font-bold flex items-center gap-3 hover:bg-cyan-400 hover:text-white transition-all text-xs uppercase tracking-widest shadow-xl transform active:scale-95">
            <UserPlus className="w-4 h-4" /> Provision Node
          </button>
        </div>
      </GlowCard>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <GlowCard key={emp.id} className="p-8 group">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-[20px] bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-3xl font-bold text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                {emp.name[0]}
              </div>
              <div className="space-y-1">
                <h5 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{emp.name}</h5>
                <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md inline-block">
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{emp.role}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Shield className="w-4 h-4 text-cyan-400/50" /> 
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Security_Clearance</span>
                </div>
                <span className="text-white/80 font-mono text-[10px] uppercase bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Lvl_02</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-gray-500">
                  <DollarSign className="w-4 h-4 text-green-400/50" /> 
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Credit_Allotment</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-mono text-sm font-bold tracking-tight">${emp.salary.toLocaleString()}</span>
                  <span className="text-[9px] text-gray-600 block uppercase font-bold">per_cycle</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${emp.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">{emp.status.toUpperCase()}</span>
                </div>
                <button className="text-[9px] text-cyan-400/40 hover:text-cyan-400 font-bold uppercase tracking-[0.3em] transition-colors border-b border-cyan-400/0 hover:border-cyan-400/40 pb-0.5">ACCESS_LOGS</button>
              </div>
            </div>
          </GlowCard>
        ))}

        {employees.length === 0 && (
          <div className="col-span-full py-24 text-center">
             <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 opacity-20">
                <Users className="w-10 h-10" />
             </div>
            <p className="text-xl font-bold text-gray-600 uppercase tracking-widest">No Personnel Detected</p>
            <p className="text-[10px] text-gray-700 uppercase tracking-[0.4em] font-bold mt-2">Initialize directory synchronization</p>
          </div>
        )}
      </div>
    </div>
  );
};

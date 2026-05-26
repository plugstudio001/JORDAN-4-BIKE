import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Users, UserPlus, Shield, Activity, Clock, DollarSign } from 'lucide-react';
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
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard title="Total Personnel" icon={Users}>
          <div className="mt-1">
            <h4 className="text-4xl font-bold text-white">{employees.length}</h4>
            <p className="text-gray-600 text-[10px] mt-1 uppercase tracking-widest font-mono">Synced Nodes</p>
          </div>
        </GlassCard>
        <GlassCard title="Attendance Rate" icon={Activity}>
          <div className="mt-1">
            <h4 className="text-4xl font-bold text-cyan-400">98.5%</h4>
            <p className="text-cyan-400/20 text-[10px] mt-1 uppercase tracking-widest font-mono">Last 24 Hours</p>
          </div>
        </GlassCard>
        <GlassCard title="Payroll Cycle" icon={Clock}>
          <div className="mt-1">
            <h4 className="text-2xl font-bold text-white">Ends in 4 Days</h4>
            <p className="text-gray-600 text-[10px] mt-1 uppercase tracking-widest font-mono">Next Pulse: June 1st</p>
          </div>
        </GlassCard>
      </div>

      {/* Directory and Action Bar */}
      <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
        <h3 className="text-sm font-bold ml-2 uppercase tracking-widest text-gray-400">Employee Directory</h3>
        <button className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-400 hover:text-white transition-all text-xs uppercase tracking-tight shadow-lg">
          <UserPlus className="w-4 h-4" /> Provision Node
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <GlassCard key={emp.id} className="group hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center text-2xl font-bold text-cyan-400 group-hover:scale-105 transition-transform">
                {emp.name[0]}
              </div>
              <div>
                <h5 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{emp.name}</h5>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{emp.role}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Shield className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Authority</span>
                </div>
                <span className="text-white/80 font-mono text-[10px] uppercase bg-white/5 px-2 py-1 rounded">Level 2</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <DollarSign className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Credit</span>
                </div>
                <span className="text-cyan-400 font-mono text-[10px] font-bold tracking-tight">${emp.salary.toLocaleString()} / PULSE</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${emp.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">{emp.status}</span>
                </div>
                <button className="text-[10px] text-cyan-400 hover:underline font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">SYS_LOGS</button>
              </div>
            </div>
          </GlassCard>
        ))}

        {employees.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-20">
            <Users className="w-20 h-20 mx-auto mb-4" />
            <p className="text-2xl font-bold">No employees detected in local mesh.</p>
          </div>
        )}
      </div>
    </div>
  );
};

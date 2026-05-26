import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  UserCircle, 
  TrendingUp, 
  Megaphone, 
  Settings,
  Zap,
  ChevronRight,
  Bell,
  Coins
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Command Center' },
  { id: 'inventory', icon: Package, label: 'Smart Inventory' },
  { id: 'sales', icon: ShoppingCart, label: 'Sales & POS' },
  { id: 'employees', icon: Users, label: 'Employees' },
  { id: 'customers', icon: UserCircle, label: 'Customer Hub' },
  { id: 'finance', icon: Coins, label: 'Finance Matrix' },
  { id: 'marketing', icon: Megaphone, label: 'Marketing' },
  { id: 'insights', icon: TrendingUp, label: 'AI Insights' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-24 h-screen bg-black/40 backdrop-blur-2xl border-r border-white/10 p-4 flex flex-col items-center gap-10"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
          <Zap className="text-white w-7 h-7" />
        </div>
      </div>

      <nav className="flex-1 w-full space-y-4">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={cn(
                "w-full flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]" 
                  : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
              )}
            >
              <item.icon className={cn(
                "w-6 h-6 transition-colors",
                isActive ? "text-cyan-400" : "group-hover:text-cyan-300"
              )} />
              <span className="text-[8px] uppercase font-bold tracking-tighter mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                {item.id === 'dashboard' ? 'CMD' : item.id.substring(0, 3).toUpperCase()}
              </span>
              
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-[-4px] top-1/4 bottom-1/4 w-1 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto mb-4 opacity-20 hover:opacity-100 transition-opacity">
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer">
           <Settings className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </motion.div>
  );
};

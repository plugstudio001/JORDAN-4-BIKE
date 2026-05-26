import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ElementType;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  title, 
  subtitle, 
  icon: Icon 
}) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group",
        className
      )}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
      
      {(title || Icon) && (
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            {title && <h3 className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">{subtitle}</p>}
          </div>
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-cyan-500/30 transition-colors">
              <Icon className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
            </div>
          )}
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

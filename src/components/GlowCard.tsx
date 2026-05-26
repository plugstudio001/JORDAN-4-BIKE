import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className, 
  onClick, 
  hoverEffect = true 
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => hoverEffect && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative rounded-3xl backdrop-blur-2xl transition-all duration-500 border overflow-hidden",
        "bg-white/[0.03] border-white/10",
        hovered && "bg-white/[0.06] border-cyan-500/30 -translate-y-1 shadow-[0_8px_32px_rgba(34,211,238,0.15)]",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
    >
      {/* Ambient Glow */}
      <div className={cn(
        "absolute -inset-[100px] bg-cyan-500/10 blur-[100px] rounded-full transition-opacity duration-700 pointer-events-none",
        hovered ? "opacity-100" : "opacity-0"
      )} />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

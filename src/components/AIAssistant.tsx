import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Cpu, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Neural connection established. I am PulseGrid AI. How can I optimize your business operations today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context: { platform: 'PulseGrid AI' } })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Protocol error: Failed to communicate with neural core." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-blue-500/20" />
        <Sparkles className="text-white w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, x: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, x: 50 }}
            className="fixed bottom-32 right-10 w-[400px] h-[600px] bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">PULSE_ASSIST</h4>
                  <p className="text-[10px] text-blue-400 font-mono">CONNECTION: STABLE</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-white/20 mt-1 uppercase font-mono">
                    {msg.role === 'ai' ? 'NEURAL_UNIT' : 'OPERATOR'}
                  </span>
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-blue-400">
                  <Zap className="w-4 h-4 animate-bounce" />
                  <span className="text-[10px] uppercase font-mono tracking-widest">Processing...</span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5">
              <div className="relative group">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Query semantic engine..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-colors shadow-lg active:scale-90"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-[9px] text-center text-white/20 mt-4 uppercase tracking-[0.3em] font-mono">End-to-End Neural Privacy Active</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

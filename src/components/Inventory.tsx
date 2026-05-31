import React, { useState, useEffect } from 'react';
import { GlowCard } from './GlowCard';
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash2, 
  AlertTriangle,
  History,
  Zap,
  Box,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, addDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { Product } from '../types';
import { cn } from '../lib/utils';

export const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stockQuantity: '',
    category: '',
    lowStockThreshold: '5',
    barcode: ''
  });

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(prods);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "products");
    });
    return () => unsubscribe();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stockQuantity: parseInt(newProduct.stockQuantity),
        lowStockThreshold: parseInt(newProduct.lowStockThreshold),
        createdAt: Timestamp.now().toDate().toISOString(),
        updatedAt: Timestamp.now().toDate().toISOString(),
      });
      setIsAddModalOpen(false);
      setNewProduct({ name: '', price: '', stockQuantity: '', category: '', lowStockThreshold: '5', barcode: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "products");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
        <div className="relative w-full md:w-96 group">
          <GlowCard className="p-0" hoverEffect={false}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search inventory matrix..."
              className="w-full bg-transparent py-4 pl-12 pr-4 text-white focus:outline-none placeholder:text-white/10 text-sm font-medium"
            />
          </GlowCard>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-[20px] hover:bg-white/10 transition-all font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-white">
            <Filter className="w-4 h-4" /> Filter_Load
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-[20px] hover:bg-cyan-400 hover:text-white transition-all font-bold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.2)] active:scale-95 transform">
            <Plus className="w-5 h-5" /> Provision Node
          </button>
        </div>
      </div>

      {/* Inventory List */}
      <GlowCard className="!p-0 border-white/5 overflow-hidden" hoverEffect={false}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold bg-white/[0.01]">
                <th className="px-8 py-6 font-bold">Identity_Vector</th>
                <th className="px-8 py-6 font-bold text-center">Category</th>
                <th className="px-8 py-6 font-bold text-center">Velocity</th>
                <th className="px-8 py-6 font-bold text-right">Value</th>
                <th className="px-8 py-6 font-bold text-center">Status</th>
                <th className="px-8 py-6 font-bold text-right pr-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {products.map((prod) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={prod.id} 
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-400/20 transition-all overflow-hidden bg-cover bg-center" style={prod.imageUrl ? { backgroundImage: `url(${prod.imageUrl})` } : undefined}>
                        {!prod.imageUrl && <Box className="w-6 h-6 text-white/5 group-hover:text-cyan-400/20 transition-colors" />}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight text-sm">{prod.name}</p>
                        <p className="text-[10px] text-gray-700 mt-0.5 font-mono uppercase font-bold tracking-widest leading-none">#{prod.barcode || 'NO_SKU_INIT'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">{prod.category || 'GENERAL'}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        "font-mono font-bold text-xl tracking-tighter",
                        prod.stockQuantity <= prod.lowStockThreshold ? "text-red-500" : "text-white/80"
                      )}>{prod.stockQuantity}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-mono text-cyan-400 font-bold tracking-tighter text-lg">
                    ${prod.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      {prod.stockQuantity <= prod.lowStockThreshold ? (
                        <div className="flex items-center gap-2 text-red-500 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="text-[9px] uppercase font-bold tracking-widest">CRITICAL_STK</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-400 px-3 py-1.5 bg-green-400/10 border border-green-400/20 rounded-xl">
                          <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor] animate-pulse" />
                          <span className="text-[9px] uppercase font-bold tracking-widest">STK_NOMINAL</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right pr-12">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-white/40 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 bg-white/5 hover:bg-red-500/10 border border-white/10 rounded-xl transition-all text-white/40 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 opacity-20">
                         <History className="w-10 h-10" />
                      </div>
                      <p className="text-xl font-bold text-gray-700 uppercase tracking-widest">Inventory Matrix Empty</p>
                      <p className="text-[10px] text-gray-800 uppercase tracking-[0.4em] font-bold mt-2">Provision nodes to populate system</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlowCard>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
            />
            <GlowCard className="relative w-full max-w-2xl p-10 border-white/10 overflow-hidden" hoverEffect={false}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold tracking-tight">Provision Node</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Initialize New Component Identity</p>
                  </div>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-white/20 hover:text-white transition-colors p-2"><X className="w-6 h-6" /></button>
                </div>
                
                <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-6 pt-4">
                  <div className="col-span-2 space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">Identity_Name</label>
                    <input 
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-white focus:ring-1 ring-cyan-500/50 outline-none transition-all placeholder:text-white/10" 
                      placeholder="Enter component name..."
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">Category_Node</label>
                    <input 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-white focus:ring-1 ring-cyan-500/50 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">Value_Credit</label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 font-mono italic">$</span>
                        <input 
                        required
                        type="number" step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-10 pr-5 text-white focus:ring-1 ring-cyan-500/50 outline-none font-mono" 
                        />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">Initial_Velocity</label>
                    <input 
                      required
                      type="number"
                      value={newProduct.stockQuantity}
                      onChange={(e) => setNewProduct({...newProduct, stockQuantity: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-white focus:ring-1 ring-cyan-500/50 outline-none font-mono" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">Threshold_Margin</label>
                    <input 
                      required
                      type="number"
                      value={newProduct.lowStockThreshold}
                      onChange={(e) => setNewProduct({...newProduct, lowStockThreshold: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-white focus:ring-1 ring-cyan-500/50 outline-none font-mono" 
                    />
                  </div>
                  <div className="col-span-2 space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">Barcode_Pulse_SKU</label>
                    <input 
                      value={newProduct.barcode}
                      onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                      placeholder="SCAN_PROTOCOL_READY"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-white focus:ring-1 ring-cyan-500/50 outline-none font-mono placeholder:text-white/10" 
                    />
                  </div>
                  
                  <button type="submit" className="col-span-2 bg-white text-black py-6 rounded-[28px] font-bold text-xl hover:bg-cyan-400 hover:text-white active:scale-95 transition-all mt-6 shadow-[0_0_50px_rgba(255,255,255,0.1)] uppercase tracking-[0.2em]">
                    Pulse To Inventory
                  </button>
                </form>
              </div>
            </GlowCard>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const X = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

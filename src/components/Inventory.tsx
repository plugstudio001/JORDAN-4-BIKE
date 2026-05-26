import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Upload,
  AlertTriangle,
  History,
  Zap
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
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search inventory matrix..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all backdrop-blur-xl"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest text-gray-400">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white text-black rounded-2xl hover:bg-cyan-400 hover:text-white transition-all font-bold shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <Plus className="w-5 h-5" /> Provision Node
          </button>
        </div>
      </div>

      {/* Inventory List */}
      <GlassCard className="!p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                <th className="px-6 py-5 font-medium">Identity</th>
                <th className="px-6 py-5 font-medium text-center">Category</th>
                <th className="px-6 py-5 font-medium text-center">Velocity</th>
                <th className="px-6 py-5 font-medium text-right">Value</th>
                <th className="px-6 py-5 font-medium text-center">Status</th>
                <th className="px-6 py-5 font-medium text-right pr-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((prod) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={prod.id} 
                  className="hover:bg-white/[0.01] transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/20 transition-all overflow-hidden bg-cover bg-center" style={prod.imageUrl ? { backgroundImage: `url(${prod.imageUrl})` } : undefined}>
                        {!prod.imageUrl && <Zap className="w-5 h-5 text-white/5" />}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{prod.name}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5 font-mono">#{prod.barcode || 'NO_SKU'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-gray-400">{prod.category || 'GENERAL'}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        "font-mono font-bold text-lg",
                        prod.stockQuantity <= prod.lowStockThreshold ? "text-red-400" : "text-white/80"
                      )}>{prod.stockQuantity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-cyan-400 font-bold tracking-tighter">
                    ${prod.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      {prod.stockQuantity <= prod.lowStockThreshold ? (
                        <div className="flex items-center gap-1.5 text-red-400 px-3 py-1 bg-red-400/5 border border-red-400/10 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="text-[9px] uppercase font-bold tracking-widest">Critical</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-green-400 px-3 py-1 bg-green-400/5 border border-green-400/10 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                          <span className="text-[9px] uppercase font-bold tracking-widest">Optimal</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right pr-10">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/20 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-white/20 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <History className="w-16 h-16 mb-4" />
                      <p className="text-xl">Your matrix is empty</p>
                      <p className="text-sm mt-2">Initialize inventory to see data points</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Initialize Component</h3>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-white/20 hover:text-white underline text-sm">Cancel</button>
                </div>
                
                <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 ml-2">Product Name</label>
                    <input 
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-blue-500/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 ml-2">Category</label>
                    <input 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-blue-500/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 ml-2">Price ($)</label>
                    <input 
                      required
                      type="number" step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-blue-500/50 outline-none font-mono" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 ml-2">Initial Quantity</label>
                    <input 
                      required
                      type="number"
                      value={newProduct.stockQuantity}
                      onChange={(e) => setNewProduct({...newProduct, stockQuantity: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-blue-500/50 outline-none font-mono" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 ml-2">Low Stock Mark</label>
                    <input 
                      required
                      type="number"
                      value={newProduct.lowStockThreshold}
                      onChange={(e) => setNewProduct({...newProduct, lowStockThreshold: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-blue-500/50 outline-none font-mono" 
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 ml-2">Barcode / UPC</label>
                    <input 
                      value={newProduct.barcode}
                      onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                      placeholder="SCANNER_READY"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-blue-500/50 outline-none font-mono placeholder:text-white/10" 
                    />
                  </div>
                  
                  <button type="submit" className="col-span-2 bg-gradient-to-r from-blue-600 to-purple-600 p-5 rounded-2xl font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all mt-4">
                    Pulse To Inventory
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

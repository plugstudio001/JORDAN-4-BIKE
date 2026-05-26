import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  CreditCard, 
  Wallet, 
  Banknote,
  Receipt,
  ScanLine,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, addDoc, query, Timestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { Product, TransactionItem } from '../types';

export const POS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<TransactionItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentModal, setPaymentModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => prods.push({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async (method: string) => {
    try {
      // Create transaction
      await addDoc(collection(db, "transactions"), {
        items: cart,
        totalAmount: total,
        paymentMethod: method,
        status: 'completed',
        timestamp: Timestamp.now().toDate().toISOString(),
      });

      // Update inventory stock
      for (const item of cart) {
        const productRef = doc(db, "products", item.productId);
        await updateDoc(productRef, {
          stockQuantity: increment(-item.quantity),
          updatedAt: Timestamp.now().toDate().toISOString()
        });
      }

      setCart([]);
      setPaymentModal(false);
      alert("Pulse synchronized. Transaction decrypted and finalized.");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "transactions");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-180px)]">
      {/* Product Grid */}
      <div className="lg:col-span-2 space-y-6 flex flex-col">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search catalog or scan barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all backdrop-blur-xl"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-md text-[10px] font-bold border border-cyan-500/30 font-mono">
            SCAN_READY
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pr-2 custom-scrollbar">
          {filteredProducts.map((product) => (
            <motion.button
              key={product.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addToCart(product)}
              className="bg-white/5 border border-white/10 rounded-[24px] p-4 text-left hover:bg-white/10 hover:border-cyan-500/30 transition-all group relative overflow-hidden h-fit"
            >
              <div className="w-full aspect-square rounded-xl bg-white/5 mb-4 flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-white/10">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <ShoppingBag className="w-10 h-10 text-white/10 group-hover:text-cyan-500/20" />
                )}
              </div>
              <p className="font-bold text-sm line-clamp-1 uppercase tracking-tight">{product.name}</p>
              <p className="text-cyan-400 font-mono text-lg mt-1 font-bold tracking-tighter">${product.price.toFixed(2)}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cart Panel */}
      <GlassCard className="flex flex-col h-full !p-0 border-white/10">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold uppercase tracking-tight">Pulse Cart</h3>
          </div>
          <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-cyan-500/20">{cart.length} NODES</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                key={item.productId} 
                className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-white/40 mt-1 font-mono">${item.price.toFixed(2)} / UNIT</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-black/40 rounded-xl border border-white/5">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="p-1.5 hover:text-blue-400 transition-colors"><Minus className="w-3 h-3" /></button>
                    <span className="w-8 text-center text-sm font-mono font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="p-1.5 hover:text-blue-400 transition-colors"><Plus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-white/20 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
              <ScanLine className="w-16 h-16 mb-4" />
              <p className="text-lg">Cart inactive</p>
              <p className="text-xs">Scan items to begin sequence</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-white/5">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                <span>Matrix Subtotal</span>
                <span className="font-mono text-white/60">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                <span>Network Protocol Fee</span>
                <span className="font-mono text-white/60">$0.00</span>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-4 border-t border-white/5">
                <span className="text-white tracking-tighter">TOTAL_PULSE</span>
                <span className="text-cyan-400 font-mono tracking-tighter shadow-cyan-500/20 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              disabled={cart.length === 0}
              onClick={() => setPaymentModal(true)}
              className="w-full bg-white text-black py-5 rounded-[24px] font-bold text-lg hover:bg-cyan-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(34,211,238,0.2)] active:scale-[0.98] uppercase tracking-tight"
            >
              Initialize Node Payment
            </button>
        </div>
      </GlassCard>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPaymentModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 overflow-hidden"
            >
              <h3 className="text-3xl font-bold mb-2">Select Channel</h3>
              <p className="text-white/40 mb-10">Choose a prioritized payment method for this transaction.</p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'card', icon: CreditCard, label: 'Credit Card', color: 'blue' },
                  { id: 'mobile', icon: Wallet, label: 'Mobile Money', color: 'purple' },
                  { id: 'cash', icon: Banknote, label: 'Fiat Cash', color: 'green' },
                  { id: 'crypto', icon: Zap, label: 'Stablecoin', color: 'yellow' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleCheckout(m.id)}
                    className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                  >
                    <m.icon className={`w-10 h-10 mb-4 group-hover:text-${m.color}-400 transition-colors`} />
                    <span className="font-bold">{m.label}</span>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setPaymentModal(false)}
                className="w-full mt-10 py-5 rounded-2xl bg-white/5 text-white/40 font-mono text-sm hover:text-white transition-colors"
              >
                ABORT_SEQUENCE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShoppingBag = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);

import React, { useState, useEffect } from 'react';
import { GlowCard } from './GlowCard';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  CreditCard, 
  Wallet, 
  Banknote,
  ScanLine,
  Zap,
  ShoppingBag
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
      await addDoc(collection(db, "transactions"), {
        items: cart,
        totalAmount: total,
        paymentMethod: method,
        status: 'completed',
        timestamp: Timestamp.now().toDate().toISOString(),
      });

      for (const item of cart) {
        const productRef = doc(db, "products", item.productId);
        await updateDoc(productRef, {
          stockQuantity: increment(-item.quantity),
          updatedAt: Timestamp.now().toDate().toISOString()
        });
      }

      setCart([]);
      setPaymentModal(false);
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
        <GlowCard className="p-1" hoverEffect={false}>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search catalog or scan barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent py-4 pl-12 pr-4 text-white focus:outline-none transition-all placeholder:text-white/10"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-md text-[10px] font-bold border border-cyan-500/20 font-mono tracking-widest">
              SCAN_READY
            </div>
          </div>
        </GlowCard>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pr-2 custom-scrollbar">
          {filteredProducts.map((product) => (
            <GlowCard
              key={product.id}
              onClick={() => addToCart(product)}
              className="p-4 group"
            >
              <div className="w-full aspect-square rounded-2xl bg-white/5 mb-4 flex items-center justify-center overflow-hidden border border-white/5 transition-colors group-hover:border-cyan-400/30">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                ) : (
                  <ShoppingBag className="w-10 h-10 text-white/10 group-hover:text-cyan-400/20 transition-colors" />
                )}
              </div>
              <p className="font-bold text-xs uppercase tracking-widest text-gray-400 line-clamp-1 group-hover:text-white transition-colors">{product.name}</p>
              <p className="text-cyan-400 font-mono text-xl mt-1 font-bold tracking-tighter">${product.price.toFixed(2)}</p>
            </GlowCard>
          ))}
        </div>
      </div>

      {/* Cart Panel */}
      <GlowCard className="flex flex-col h-full !p-0 overflow-hidden" hoverEffect={false}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-400/10 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight">Pulse Cart</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Transaction Buffer</p>
            </div>
          </div>
          <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border border-cyan-500/20">{cart.length} NODES</span>
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
                className="flex items-center justify-between bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:border-cyan-400/20 transition-colors"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-bold text-sm truncate uppercase tracking-tight">{item.name}</p>
                  <p className="text-[10px] text-white/20 mt-1 font-mono uppercase tracking-widest">${item.price.toFixed(2)} / unit</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-black/40 rounded-xl border border-white/5">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="p-2 hover:text-cyan-400 transition-colors"><Minus className="w-3 h-3" /></button>
                    <span className="w-8 text-center text-xs font-mono font-bold text-cyan-400">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="p-2 hover:text-cyan-400 transition-colors"><Plus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-white/10 hover:text-red-400 transition-colors p-1"><X className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-10 py-20">
              <ScanLine className="w-16 h-16 mb-4" />
              <p className="text-xl font-bold uppercase tracking-widest">Cart Inactive</p>
              <p className="text-[10px] uppercase tracking-[0.4em] mt-2 font-bold">Synchronize Node for Checkout</p>
            </div>
          )}
        </div>

        <div className="p-8 bg-white/[0.04] border-t border-white/10">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
                <span>Matrix Subtotal</span>
                <span className="font-mono text-white/60">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
                <span>Network Protocol Fee</span>
                <span className="font-mono text-white/60">$0.00</span>
              </div>
              <div className="flex justify-between items-end pt-6 border-t border-white/10">
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.4em] block mb-1">Total_Pulse</span>
                  <span className="text-white text-3xl font-bold tracking-tighter">EST_CHECKOUT</span>
                </div>
                <span className="text-cyan-400 text-4xl font-bold font-mono tracking-tighter drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              disabled={cart.length === 0}
              onClick={() => setPaymentModal(true)}
              className="w-full bg-white text-black py-5 rounded-3xl font-bold text-lg hover:bg-cyan-400 hover:text-white transition-all disabled:opacity-10 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(34,211,238,0.2)] active:scale-[0.98] uppercase tracking-widest font-sans"
            >
              Initialize Node Payment
            </button>
        </div>
      </GlowCard>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPaymentModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
            />
            <GlowCard className="relative w-full max-w-lg p-10 border-white/10 overflow-hidden" hoverEffect={false}>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-2 tracking-tight">Select Channel</h3>
                <p className="text-white/40 mb-10 text-sm uppercase tracking-widest font-bold">Priority Resolution Priority</p>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'card', icon: CreditCard, label: 'Credit Card', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { id: 'mobile', icon: Wallet, label: 'M-Pesa', color: 'text-green-400', bg: 'bg-green-400/10' },
                    { id: 'cash', icon: Banknote, label: 'Fiat Cash', color: 'text-purple-400', bg: 'bg-purple-400/10' },
                    { id: 'crypto', icon: Zap, label: 'Stablecoin', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleCheckout(m.id)}
                      className="flex flex-col items-center justify-center p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-cyan-400/30 transition-all group active:scale-95"
                    >
                      <div className={`p-4 rounded-2xl ${m.bg} ${m.color} mb-4 transition-transform group-hover:scale-110`}>
                        <m.icon className="w-8 h-8" />
                      </div>
                      <span className="font-bold uppercase text-[10px] tracking-widest text-gray-500 group-hover:text-white transition-colors">{m.label}</span>
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => setPaymentModal(false)}
                  className="w-full mt-10 py-5 rounded-2xl text-[10px] text-white/20 font-bold uppercase tracking-[0.5em] hover:text-white transition-colors border border-white/5"
                >
                  ABORT_SEQUENCE
                </button>
              </div>
            </GlowCard>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

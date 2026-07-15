import { useState, useEffect } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export function PricingFlow({ products, setProducts }: { products: Product[], setProducts: (p: Product[]) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const firstIncomplete = products.findIndex(p => !p.completed);
    if (firstIncomplete !== -1) {
      setCurrentIndex(firstIncomplete);
    }
  }, []);
  
  const currentProduct = products[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (currentProduct && currentProduct.cost && currentProduct.price) {
          handleSaveAndNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, products]);

  if (!currentProduct) {
    return (
      <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-slate-200 max-w-md w-full">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-3">Tudo Pronto!</h2>
        <p className="text-slate-500 font-medium">Todos os produtos foram precificados com sucesso.</p>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<Product>) => {
    const newProducts = [...products];
    newProducts[currentIndex] = { ...currentProduct, ...updates };
    setProducts(newProducts);
  };

  const handleSaveAndNext = () => {
    const newProducts = [...products];
    newProducts[currentIndex] = { ...currentProduct, completed: true };
    setProducts(newProducts);
    setDirection(1);

    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const nextIncomplete = newProducts.findIndex(p => !p.completed);
      if (nextIncomplete !== -1) {
        setCurrentIndex(nextIncomplete);
      } else {
        setCurrentIndex(newProducts.length);
      }
    }
  };

  const navTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const cost = parseFloat(currentProduct.cost) || 0;
  const price = parseFloat(currentProduct.price) || 0;
  const profit = price - cost;
  const margin = cost > 0 ? (profit / cost) * 100 : 0;

  return (
    <div className="max-w-2xl w-full">
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentProduct.id}
            custom={direction}
            initial={{ opacity: 0, x: 20 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 * direction }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-full mb-2 tracking-wider">PRODUTO {currentIndex + 1} DE {products.length}</span>
                  <h2 className="text-3xl font-bold text-slate-800">{currentProduct.name}</h2>
                </div>
                <div className="flex flex-col items-end">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <span className="text-sm font-medium text-slate-400 group-hover:text-slate-600">Marcar como Revisado</span>
                    <input 
                      type="checkbox"
                      checked={currentProduct.completed}
                      onChange={(e) => handleUpdate({ completed: e.target.checked })}
                      className="w-6 h-6 rounded-md border-slate-300 text-rose-600 focus:ring-rose-500 transition-all cursor-pointer accent-rose-600"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Custo Unitário (R$)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 font-mono">R$</span>
                    <input 
                      type="number"
                      value={currentProduct.cost}
                      onChange={(e) => handleUpdate({ cost: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-bold focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Preço de Venda (R$)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-rose-400 font-mono">R$</span>
                    <input 
                      type="number"
                      value={currentProduct.price}
                      onChange={(e) => handleUpdate({ price: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-rose-50 border border-rose-100 rounded-2xl text-xl font-bold text-rose-700 placeholder-rose-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-4 sm:gap-0">
                <div className="flex-1 sm:border-r border-slate-200 sm:pr-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Margem Sugerida</p>
                  <p className="text-lg font-bold text-slate-700">{price > 0 && cost > 0 ? `+ ${margin.toFixed(1)}%` : '-'}</p>
                </div>
                <div className="flex-1 sm:border-r border-slate-200 sm:px-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Lucro Bruto</p>
                  <p className={`text-lg font-bold ${profit > 0 ? 'text-green-600' : 'text-slate-700'}`}>R$ {profit.toFixed(2)}</p>
                </div>
                <div className="flex-1 sm:pl-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Status de Fluxo</p>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${currentProduct.completed ? 'bg-green-400' : 'bg-amber-400'}`}></span>
                    <span className="text-sm font-semibold text-slate-600">{currentProduct.completed ? 'Concluído' : 'Pendente'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col-reverse gap-4 sm:flex-row sm:items-center justify-between">
              <button 
                onClick={() => navTo(currentIndex + 1)}
                className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 uppercase transition-colors"
              >
                {currentIndex < products.length - 1 ? 'Pular por enquanto' : 'Ver finalizados'}
              </button>
              <button 
                onClick={handleSaveAndNext}
                className="px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-lg font-bold shadow-lg shadow-rose-100 flex items-center justify-center space-x-3 transition-all"
              >
                <span>Salvar e Avançar</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center mt-6 px-4">
        <button 
          disabled={currentIndex === 0} 
          onClick={() => navTo(currentIndex - 1)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors text-sm font-bold uppercase"
        >
          <ChevronLeft size={16} /> Anterior
        </button>
        <p className="text-center text-slate-400 text-xs font-medium hidden sm:block">
          Atalho de teclado: <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold mx-1 shadow-sm">Enter ↵</kbd> para salvar
        </p>
        <button 
          disabled={currentIndex === products.length - 1} 
          onClick={() => navTo(currentIndex + 1)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors text-sm font-bold uppercase"
        >
          Próximo <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductSetup } from './ProductSetup';
import { PricingFlow } from './PricingFlow';
import { exportToCSV } from '../utils/csv';
import { Download } from 'lucide-react';

export function PricingDashboard({ onLogout }: { onLogout: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dudamakes_products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('dudamakes_products', JSON.stringify(products));
    }
  }, [products, isLoaded]);

  if (!isLoaded) return null;

  if (products.length === 0) {
    return <ProductSetup onSave={(newProducts) => setProducts(newProducts)} />;
  }

  const completedCount = products.filter(p => p.completed).length;
  const progress = Math.round((completedCount / products.length) * 100) || 0;

  const handleReset = () => {
    if (confirm('Tem certeza que deseja apagar a lista atual e começar uma nova?')) {
      setProducts([]);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Dudamakes <span className="text-rose-600">Precificação</span></span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right flex items-center gap-4">
             <button onClick={handleReset} className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors uppercase tracking-wider block" title="Nova Lista">Nova Lista</button>
             <button onClick={onLogout} className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider block" title="Sair">Sair</button>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-inner flex items-center justify-center">
            <span className="text-xs font-bold text-slate-600">US</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col shrink-0">
          <div className="p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Progresso do Lote</h3>
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-bold text-slate-800">{progress}%</span>
                <span className="text-xs text-slate-500 font-medium">{completedCount} de {products.length} itens</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700">
                <span className="text-sm font-semibold">Produto Atual</span>
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                <span className="text-sm font-medium">Próximos na Fila</span>
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{products.length - completedCount}</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                <span className="text-sm font-medium">Revisar Concluídos</span>
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-green-600 font-bold">{completedCount}</span>
              </button>
            </div>
          </div>

          <div className="mt-auto p-6 border-t border-slate-100 space-y-3">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Exportar Dados</p>
             <button onClick={() => exportToCSV(products)} className="w-full py-2.5 px-4 bg-slate-800 text-white rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 hover:bg-slate-900 transition-all">
                <Download size={16} /> <span>Planilha .CSV</span>
             </button>
          </div>
        </aside>

        <section className="flex-1 bg-slate-50 p-6 md:p-12 flex flex-col items-center justify-center overflow-y-auto w-full">
          <PricingFlow products={products} setProducts={setProducts} />
        </section>
      </main>
      
      <footer className="h-8 bg-slate-800 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Banco de dados conectado</span>
          </span>
        </div>
        <p className="text-[10px] text-slate-500 font-medium">
          Dudamakes SaaS Interface - Hospedado em Vercel
        </p>
      </footer>
    </div>
  );
}

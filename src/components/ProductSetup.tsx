import { useState } from 'react';
import { Product } from '../types';

export function ProductSetup({ onSave }: { onSave: (p: Product[]) => void }) {
  const [input, setInput] = useState('');

  const handleStart = () => {
    const lines = input.split('\n').filter(l => l.trim() !== '');
    const newProducts: Product[] = lines.map((line) => ({
      id: crypto.randomUUID(),
      name: line.trim(),
      cost: '',
      price: '',
      completed: false
    }));
    onSave(newProducts);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Dudamakes <span className="text-rose-600">Precificação</span></span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Importar Produtos</h2>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">Cole a lista abaixo, um produto por linha.</p>
          
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 p-6 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none font-mono text-sm mb-8 bg-slate-50 focus:bg-white text-slate-700 leading-relaxed"
            placeholder={"Exemplo:\n\nBolsa de Couro\nCarteira Feminina\nCinto Masculino"}
          />

          <button 
            onClick={handleStart}
            disabled={input.trim() === ''}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none text-white px-6 py-4 rounded-xl text-lg font-bold shadow-lg shadow-rose-100 transition-all"
          >
            Iniciar Precificação
          </button>
        </div>
      </main>

      <footer className="h-8 bg-slate-800 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pronto para importar</span>
          </span>
        </div>
        <p className="text-[10px] text-slate-500 font-medium">
          Dudamakes SaaS Interface - Hospedado em Vercel
        </p>
      </footer>
    </div>
  );
}

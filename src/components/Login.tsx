import { useState } from 'react';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && pass) {
      localStorage.setItem('dudamakes_auth', 'true');
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900 font-sans">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 w-full max-w-md">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4">D</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Dudamakes <span className="text-rose-600">Precificação</span></h1>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Acesso Restrito</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase">Usuário</label>
            <input 
              type="text" 
              value={user}
              onChange={e => setUser(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all bg-slate-50 focus:bg-white text-slate-800 font-medium"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase">Senha</label>
            <input 
              type="password" 
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all bg-slate-50 focus:bg-white text-slate-800 font-medium"
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white px-6 py-4 rounded-xl text-lg font-bold shadow-lg shadow-rose-100 transition-all mt-4"
          >
            Acessar Sistema
          </button>
        </form>
      </div>
      
      <footer className="mt-12 text-center">
         <div className="flex items-center justify-center space-x-2 mb-2">
           <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sistemas Operacionais</span>
         </div>
         <p className="text-[10px] text-slate-500 font-medium">Dudamakes SaaS Interface - Hospedado em Vercel</p>
      </footer>
    </div>
  );
}

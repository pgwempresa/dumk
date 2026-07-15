/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { PricingDashboard } from './components/PricingDashboard';
import { getAuthStatus, logout } from './lib/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAuthStatus()
      .then((status) => {
        setNeedsSetup(status.needsSetup);
        setIsLoggedIn(status.authenticated);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogin = () => {
    setNeedsSetup(false);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await logout().catch(() => {});
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-semibold">
        Carregando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900">
        <div className="bg-white border border-red-100 shadow-xl rounded-2xl p-8 max-w-md">
          <p className="text-sm font-bold text-red-600 uppercase mb-2">Erro de configuracao</p>
          <h1 className="text-2xl font-bold mb-3">Nao foi possivel conectar ao sistema.</h1>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoggedIn ? (
        <PricingDashboard onLogout={handleLogout} />
      ) : (
        <Login needsSetup={needsSetup} onLogin={handleLogin} />
      )}
    </>
  );
}

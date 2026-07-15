/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { PricingDashboard } from './components/PricingDashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('dudamakes_auth');
    if (auth === 'true') {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('dudamakes_auth');
    setIsLoggedIn(false);
  };

  if (isLoading) return null;

  return (
    <>
      {isLoggedIn ? (
        <PricingDashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}


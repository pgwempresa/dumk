import { Product } from '../types';

type AuthStatus = {
  needsSetup: boolean;
  authenticated: boolean;
  hasProducts: boolean;
};

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Erro inesperado.');
  }

  return data;
}

export function getAuthStatus() {
  return request<AuthStatus>('/api/auth/status');
}

export function setupAccount(username: string, password: string) {
  return request('/api/auth/setup', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function login(username: string, password: string) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function logout() {
  return request('/api/auth/logout', { method: 'POST' });
}

export function getProducts() {
  return request<{ products: Product[] }>('/api/products');
}

export function saveProducts(products: Product[]) {
  return request<{ products: Product[] }>('/api/products', {
    method: 'POST',
    body: JSON.stringify({ products }),
  });
}

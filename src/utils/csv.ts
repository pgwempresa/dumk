import { Product } from '../types';

export function exportToCSV(products: Product[]) {
  const headers = ['Produto', 'Custo (R$)', 'Preço de Venda (R$)', 'Status'];
  
  const rows = products.map(p => [
    `"${p.name.replace(/"/g, '""')}"`,
    p.cost || '0',
    p.price || '0',
    p.completed ? 'Concluido' : 'Pendente'
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'dudamakes_precificacao.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

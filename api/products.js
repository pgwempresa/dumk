import { randomUUID } from 'node:crypto';
import { getSql } from './_lib/db.js';
import { methodNotAllowed, readJson, sendJson } from './_lib/http.js';
import { requireUser } from './_lib/auth.js';

function toProduct(row) {
  return {
    id: row.id,
    name: row.name,
    cost: row.cost,
    price: row.price,
    completed: row.completed,
  };
}

export default async function handler(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;

  const db = getSql();

  try {
    if (req.method === 'GET') {
      const rows = await db`
        SELECT id, name, cost, price, completed
        FROM products
        ORDER BY position ASC, updated_at ASC
      `;
      return sendJson(res, 200, { products: rows.map(toProduct) });
    }

    if (req.method === 'POST') {
      const { products } = await readJson(req);

      if (!Array.isArray(products)) {
        return sendJson(res, 400, { error: 'Lista de produtos invalida.' });
      }

      await db`DELETE FROM products`;

      for (let index = 0; index < products.length; index += 1) {
        const product = products[index];
        await db`
          INSERT INTO products (id, name, cost, price, completed, position, updated_at)
          VALUES (
            ${product.id || randomUUID()},
            ${String(product.name || '').trim()},
            ${String(product.cost || '')},
            ${String(product.price || '')},
            ${Boolean(product.completed)},
            ${index},
            NOW()
          )
        `;
      }

      const rows = await db`
        SELECT id, name, cost, price, completed
        FROM products
        ORDER BY position ASC, updated_at ASC
      `;
      return sendJson(res, 200, { products: rows.map(toProduct) });
    }

    return methodNotAllowed(res);
  } catch (error) {
    return sendJson(res, error.statusCode || 500, { error: error.message || 'Erro ao salvar produtos.' });
  }
}

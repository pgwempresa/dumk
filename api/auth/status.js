import { ensureSchema, getSql } from '../_lib/db.js';
import { methodNotAllowed, sendJson } from '../_lib/http.js';
import { getCookie, verifySession } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res);

  try {
    await ensureSchema();
    const db = getSql();
    const [userCount, productCount] = await Promise.all([
      db`SELECT COUNT(*)::INT AS count FROM users`,
      db`SELECT COUNT(*)::INT AS count FROM products`,
    ]);
    const session = verifySession(getCookie(req, 'dudamakes_session'));

    return sendJson(res, 200, {
      needsSetup: userCount[0].count === 0,
      authenticated: Boolean(session),
      hasProducts: productCount[0].count > 0,
    });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || 'Erro ao carregar status.' });
  }
}

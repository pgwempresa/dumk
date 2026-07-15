import { ensureSchema, getSql } from '../_lib/db.js';
import { createSession, sessionCookie, verifyPassword } from '../_lib/auth.js';
import { methodNotAllowed, readJson, sendJson } from '../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res);

  try {
    await ensureSchema();
    const { username, password } = await readJson(req);

    const db = getSql();
    const users = await db`
      SELECT id, username, password_hash
      FROM users
      WHERE username = ${String(username || '').trim()}
      LIMIT 1
    `;

    if (!users[0] || !(await verifyPassword(String(password || ''), users[0].password_hash))) {
      return sendJson(res, 401, { error: 'Usuario ou senha incorretos.' });
    }

    return sendJson(res, 200, { user: { id: users[0].id, username: users[0].username } }, {
      'Set-Cookie': sessionCookie(createSession(users[0])),
    });
  } catch (error) {
    return sendJson(res, error.statusCode || 500, { error: error.message || 'Erro ao entrar.' });
  }
}

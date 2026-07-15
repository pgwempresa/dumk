import { ensureSchema, getSql } from '../_lib/db.js';
import { hashPassword, createSession, sessionCookie } from '../_lib/auth.js';
import { methodNotAllowed, readJson, sendJson } from '../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res);

  try {
    await ensureSchema();
    const { username, password } = await readJson(req);

    if (!username?.trim() || !password || password.length < 6) {
      return sendJson(res, 400, { error: 'Informe usuario e senha com pelo menos 6 caracteres.' });
    }

    const db = getSql();
    const existing = await db`SELECT COUNT(*)::INT AS count FROM users`;

    if (existing[0].count > 0) {
      return sendJson(res, 409, { error: 'O usuario inicial ja foi criado.' });
    }

    const passwordHash = await hashPassword(password);
    const users = await db`
      INSERT INTO users (username, password_hash)
      VALUES (${username.trim()}, ${passwordHash})
      RETURNING id, username
    `;

    return sendJson(res, 200, { user: users[0] }, {
      'Set-Cookie': sessionCookie(createSession(users[0])),
    });
  } catch (error) {
    return sendJson(res, error.statusCode || 500, { error: error.message || 'Erro ao criar usuario.' });
  }
}

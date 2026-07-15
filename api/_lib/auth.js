import crypto from 'node:crypto';
import { ensureSchema, getSql } from './db.js';
import { sendJson } from './http.js';

const COOKIE_NAME = 'dudamakes_session';
const DAY = 60 * 60 * 24;

function getSecret() {
  return process.env.SESSION_SECRET || process.env.DATABASE_URL || 'dev-secret-change-me';
}

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function sign(payload) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

export function createSession(user) {
  const payload = base64url(JSON.stringify({
    sub: user.id,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + DAY * 30,
  }));
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token) {
  if (!token || !token.includes('.')) return null;

  const [payload, signature] = token.split('.');
  const expected = sign(payload);
  if (signature.length !== expected.length) return null;
  const isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!isValid) return null;

  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;

  return data;
}

export function getCookie(req, name) {
  const cookie = req.headers.cookie || '';
  const match = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : '';
}

export function sessionCookie(token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${DAY * 30}${secure}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export async function requireUser(req, res) {
  await ensureSchema();
  const session = verifySession(getCookie(req, COOKIE_NAME));

  if (!session?.sub) {
    sendJson(res, 401, { error: 'Sessao expirada. Faca login novamente.' });
    return null;
  }

  const db = getSql();
  const users = await db`SELECT id, username FROM users WHERE id = ${session.sub} LIMIT 1`;

  if (!users[0]) {
    sendJson(res, 401, { error: 'Usuario nao encontrado.' });
    return null;
  }

  return users[0];
}

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('base64url');
  const hash = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('base64url'));
    });
  });
  return `pbkdf2$${salt}$${hash}`;
}

export async function verifyPassword(password, stored) {
  const [, salt, hash] = stored.split('$');
  if (!salt || !hash) return false;

  const candidate = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('base64url'));
    });
  });

  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}

import { Context, Next } from 'hono'

// ─── Crypto helpers (Web Crypto API) ────────────────────

const encoder = new TextEncoder()

export async function hashPassword(password: string, salt?: string): Promise<string> {
  const s = salt || crypto.randomUUID()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(s), iterations: 100_000, hash: 'SHA-256' },
    key, 256
  )
  const hash = btoa(String.fromCharCode(...new Uint8Array(bits)))
  return `${s}:${hash}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt] = stored.split(':')
  if (!salt) return false
  const check = await hashPassword(password, salt)
  return check === stored
}

// ─── JWT helpers ────────────────────────────────────────

async function getSigningKey(secret: string) {
  return crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']
  )
}

function base64url(data: ArrayBuffer | Uint8Array | string): string {
  const bytes = typeof data === 'string' ? encoder.encode(data) : new Uint8Array(data)
  return btoa(String.fromCharCode(...bytes)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function base64urlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - str.length % 4) % 4)
  return atob(padded)
}

export async function createToken(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64url(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 7 * 86400 }))
  const key = await getSigningKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(`${header}.${body}`))
  return `${header}.${body}.${base64url(sig)}`
}

export async function verifyToken(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const [header, body, sig] = token.split('.')
    if (!header || !body || !sig) return null
    const key = await getSigningKey(secret)
    const sigBytes = Uint8Array.from(base64urlDecode(sig), c => c.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(`${header}.${body}`))
    if (!valid) return null
    const payload = JSON.parse(base64urlDecode(body))
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch { return null }
}

// ─── Hono middleware ────────────────────────────────────

export function authMiddleware() {
  return async (c: Context, next: Next) => {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401)
    const secret = c.env.JWT_SECRET || 'jimbo77-community-secret-key'
    const payload = await verifyToken(auth.slice(7), secret)
    if (!payload) return c.json({ error: 'Invalid or expired token' }, 401)
    c.set('userId', payload.sub)
    c.set('userRole', payload.role)
    await next()
  }
}

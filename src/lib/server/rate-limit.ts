import 'server-only'
import { createHash } from 'node:crypto'

/**
 * Простое ограничение частоты в памяти процесса (скользящее окно).
 * Для нескольких экземпляров приложения замените на общее хранилище (Redis и т. п.).
 * IP хранится только в виде хеша и не логируется.
 */
const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 5
const hits = new Map<string, number[]>()

export function clientKey(headers: Headers): string {
  const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown'
  return createHash('sha256').update(ip + (process.env.RATE_LIMIT_SALT ?? '')).digest('hex').slice(0, 32)
}

export function checkRateLimit(key: string, now = Date.now()): { allowed: boolean; retryAfterSec: number } {
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (list.length >= MAX_REQUESTS) {
    hits.set(key, list)
    return { allowed: false, retryAfterSec: Math.ceil((WINDOW_MS - (now - list[0])) / 1000) }
  }
  list.push(now)
  hits.set(key, list)
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k)
  }
  return { allowed: true, retryAfterSec: 0 }
}

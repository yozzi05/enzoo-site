import { NextResponse } from 'next/server'
import { LIMITS, validateAppointment, type AppointmentInput } from '@/lib/appointment'
import { deliverAppointment, getDeliveryMode } from '@/lib/server/delivery'
import { getServiceOption } from '@/content/service-options'
import { checkRateLimit, clientKey } from '@/lib/server/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type ErrorCode = 'disabled' | 'bad_request' | 'too_large' | 'rate_limited' | 'validation' | 'price_changed' | 'delivery_failed'

function fail(code: ErrorCode, status: number, extra: Record<string, unknown> = {}, headers?: HeadersInit) {
  // В лог попадает только код ошибки - без имени, телефона и комментария.
  if (code === 'delivery_failed') console.warn('[appointment] delivery failed', extra.reason ?? '')
  return NextResponse.json({ ok: false, code, ...extra }, { status, headers })
}

export async function POST(req: Request) {
  if (getDeliveryMode() === 'disabled') return fail('disabled', 503)

  if (!req.headers.get('content-type')?.includes('application/json')) return fail('bad_request', 415)
  const declared = Number(req.headers.get('content-length') ?? 0)
  if (declared > LIMITS.bodyBytes) return fail('too_large', 413)

  const rl = checkRateLimit(clientKey(req.headers))
  if (!rl.allowed) return fail('rate_limited', 429, {}, { 'retry-after': String(rl.retryAfterSec) })

  let body: Partial<AppointmentInput>
  try {
    const text = await req.text()
    if (new TextEncoder().encode(text).length > LIMITS.bodyBytes) return fail('too_large', 413)
    body = JSON.parse(text)
    if (!body || typeof body !== 'object' || Array.isArray(body)) return fail('bad_request', 400)
  } catch {
    return fail('bad_request', 400)
  }

  // Honeypot: поле скрыто от людей. Заявка не доставляется.
  if (typeof body.website === 'string' && body.website.trim() !== '') return fail('bad_request', 400)

  const result = validateAppointment(body)
  if (!result.ok) return fail('validation', 422, { errors: result.errors })

  // Цена берётся из прайса на сервере. Если посетитель видел другую сумму - показываем актуальную и просим подтвердить.
  const option = getServiceOption(result.data.service)
  if (option?.signature && body.priceSignature !== option.signature) {
    return fail('price_changed', 409, { service: option })
  }

  const delivery = await deliverAppointment(result.data)
  if (!delivery.ok) return fail('delivery_failed', 502, { reason: delivery.reason })

  return NextResponse.json({ ok: true, id: delivery.id.slice(0, 8) }, { status: 201 })
}

export function GET() {
  return NextResponse.json({ ok: false, code: 'method_not_allowed' }, { status: 405, headers: { allow: 'POST' } })
}

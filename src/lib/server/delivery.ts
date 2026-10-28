import 'server-only'
import { appendFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { serviceLabel, speciesLabel, type AppointmentData } from '@/lib/appointment'

/**
 * Адаптеры доставки заявок. Канал выбирается переменной APPOINTMENT_DELIVERY.
 *  - telegram: бот отправляет сообщение в согласованный чат клиники;
 *  - webhook: POST JSON на согласованный адрес (CRM, почтовый шлюз);
 *  - test: запись в локальный файл .data/test-outbox.jsonl, только вне production;
 *  - не задано / неизвестно: приём заявок выключен, сайт предлагает звонок.
 * Получатель заявок не угадывается: без настроенного канала форма не показывается.
 */

export type DeliveryMode = 'telegram' | 'webhook' | 'test' | 'disabled'
export type DeliveryResult = { ok: true; id: string } | { ok: false; reason: 'not_configured' | 'upstream_error' | 'timeout' }

const TIMEOUT_MS = 8000

export function getDeliveryMode(): DeliveryMode {
  const mode = process.env.APPOINTMENT_DELIVERY
  if (mode === 'telegram' && process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) return 'telegram'
  if (mode === 'webhook' && process.env.APPOINTMENT_WEBHOOK_URL) return 'webhook'
  if (mode === 'test' && process.env.NODE_ENV !== 'production') return 'test'
  return 'disabled'
}

export function isAppointmentEnabled(): boolean {
  return getDeliveryMode() !== 'disabled'
}

function formatMessage(id: string, d: AppointmentData): string {
  const rows = [
    `Заявка с сайта EnZoo № ${id.slice(0, 8)}`,
    `Имя: ${d.name}`,
    `Телефон: ${d.phone}`,
    d.species && `Питомец: ${speciesLabel(d.species)}`,
    d.service && `Услуга: ${serviceLabel(d.service)}`,
    d.date && `Желательная дата: ${d.date.split('-').reverse().join('.')}`,
    d.comment && `Комментарий: ${d.comment}`,
    '',
    'Это заявка на согласование: время нужно подтвердить звонком.',
  ]
  return rows.filter((r): r is string => typeof r === 'string').join('\n')
}

async function postJson(url: string, body: unknown, headers: Record<string, string> = {}): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  })
}

export async function deliverAppointment(d: AppointmentData): Promise<DeliveryResult> {
  const id = randomUUID()
  const mode = getDeliveryMode()
  try {
    switch (mode) {
      case 'telegram': {
        const res = await postJson(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: formatMessage(id, d),
          disable_web_page_preview: true,
        })
        const json = (await res.json().catch(() => null)) as { ok?: boolean } | null
        return res.ok && json?.ok === true ? { ok: true, id } : { ok: false, reason: 'upstream_error' }
      }
      case 'webhook': {
        const secret = process.env.APPOINTMENT_WEBHOOK_SECRET
        const res = await postJson(
          process.env.APPOINTMENT_WEBHOOK_URL!,
          { id, createdAt: new Date().toISOString(), source: 'enzoo-site', ...d, text: formatMessage(id, d) },
          secret ? { authorization: `Bearer ${secret}` } : {},
        )
        return res.ok ? { ok: true, id } : { ok: false, reason: 'upstream_error' }
      }
      case 'test': {
        if (process.env.TEST_DELIVERY_FAIL === '1') return { ok: false, reason: 'upstream_error' }
        const dir = path.join(process.cwd(), '.data')
        await mkdir(dir, { recursive: true })
        await appendFile(path.join(dir, 'test-outbox.jsonl'), JSON.stringify({ id, createdAt: new Date().toISOString(), ...d }) + '\n', 'utf8')
        return { ok: true, id }
      }
      default:
        return { ok: false, reason: 'not_configured' }
    }
  } catch (e) {
    const timeout = e instanceof Error && (e.name === 'TimeoutError' || e.name === 'AbortError')
    return { ok: false, reason: timeout ? 'timeout' : 'upstream_error' }
  }
}
